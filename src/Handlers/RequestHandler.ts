import { IncomingMessage, ServerResponse } from "http";
import { APIService, IoCService, LogService } from "../Services";
import URLService from "../Services/URLService";
import { IRequestPack } from "../Interfaces";
import { Knex } from "knex";
import { toAxeRequestResponsePair } from "../Services/ConverterService";
import ApiError from "src/Exceptions/ApiError";

const api = APIService.getInstance();

const return404 = (response: ServerResponse) => {
  response.statusCode = 404;
  response.write(JSON.stringify({ error: "Resource not found" }));
  response.end();
};

export default async (request: IncomingMessage, response: ServerResponse) => {
  LogService.debug(`${request.method} ${request.url}`);

  const { axeRequest, axeResponse } = toAxeRequestResponsePair(
    request,
    response
  );
  const match = URLService.match(axeRequest);

  if (!match) {
    LogService.warn(`The URL is not matched! ${request.method} ${request.url}`);
    return return404(response);
  }

  // We should set the params
  axeRequest.params = match.params;

  const database = (await IoCService.use("Database")) as Knex;

  // Prepare the database by the transaction option
  let trx: Knex.Transaction | null = null;
  if (match.hasTransaction) {
    LogService.warn("\tDB transaction created");
    trx = await database.transaction();
  }

  const context: IRequestPack = {
    ...match.data,
    params: match.params,
    api,
    req: axeRequest,
    res: axeResponse,
    isTransactionOpen: match.hasTransaction,
    database: match.hasTransaction && trx ? trx : database,
  };

  response.setHeader("Content-Type", "application/json");
  response.setHeader("x-powered-by", "Axe API");

  for (const phase of match.phases) {
    // If there is an non-async phase, it should be an Event function
    if (phase.isAsync === false) {
      phase.callback(context);
      LogService.debug(`\t${phase.name}()✓`);
      continue;
    }

    // Middleware and hook calls
    try {
      await phase.callback(context);
      LogService.debug(`\t✓ ${phase.name}()`);
    } catch (error: any) {
      LogService.error(`\t${error.message} ${phase.callback}`);

      // Rollback transaction
      if (match.hasTransaction && trx) {
        LogService.warn("\tDB transaction rollback");
        trx.rollback();
      }

      if (error.type === "ApiError") {
        const apiError: ApiError = error as ApiError;
        return axeResponse
          .status(apiError.status)
          .json({ error: apiError.message });
      }

      // TODO: We need an error handler.
      axeResponse.status(500).json({ error: error.toString() });
      break;
    }

    // If the response is not created, we should go to the next phase
    if (context.res.isResponded() === false) {
      continue;
    }

    // If the response is an error, and we have an active transaction,
    // we should rollback it before the HTTP request end.
    if (context.res.statusCode() >= 400 && context.res.statusCode() < 599) {
      if (match.hasTransaction && trx) {
        LogService.warn("\tDB transaction rollback");
        trx.rollback();
      }
      LogService.debug(`\tResponse ${context.res.statusCode()}`);
      break;
    }

    LogService.debug(`\tResponse ${context.res.statusCode()}`);
    // We should brake the for-loop
    break;
  }
};
