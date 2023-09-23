import { IncomingMessage, ServerResponse } from "http";
import { APIService, IoCService, LogService } from "../Services";
import URLService from "../Services/URLService";
import { IContext } from "../Interfaces";
import { Knex } from "knex";
import { toAxeRequestResponsePair } from "../Services/ConverterService";
import ApiError from "../Exceptions/ApiError";
import { NextFunction } from "connect";

const return404 = (response: ServerResponse) => {
  response.statusCode = 404;
  response.write(JSON.stringify({ error: "Resource not found" }));
  response.end();
};

export default async (
  request: IncomingMessage,
  response: ServerResponse,
  next: NextFunction,
) => {
  const api = APIService.getInstance();
  LogService.debug(`📥 ${request.method} ${request.url}`);

  const { axeRequest, axeResponse } = toAxeRequestResponsePair(
    request,
    response,
  );
  const match = URLService.match(axeRequest);

  if (!match) {
    LogService.warn(`The URL is not matched! ${request.method} ${request.url}`);
    return return404(response);
  }

  // We should set the params
  axeRequest.params = match.params;

  const database = await IoCService.use<Knex>("Database");

  // Prepare the database by the transaction option
  let trx: Knex.Transaction | null = null;
  if (match.hasTransaction) {
    LogService.warn("\tDB transaction created");
    trx = await database.transaction();
  }

  const context: IContext = {
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
      LogService.debug(`\t🔄 ${phase.name}()`);
      phase.callback(context);
      continue;
    }

    // Middleware and hook calls
    try {
      LogService.debug(`\t🔄 ${phase.name}()`);
      await phase.callback(context);
    } catch (error: any) {
      LogService.error(error);

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

      next(error);
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

    LogService.debug(`\t🟢 Response ${context.res.statusCode()}`);
    // We should brake the for-loop
    break;
  }
};
