import { IncomingMessage, ServerResponse } from "http";
import { APIService, IoCService } from "../Services";
import URLService from "../Services/URLService";
import { IRequestPack } from "../Interfaces";
import { Knex } from "knex";
import AxeRequest from "../Services/AxeRequest";
import AxeResponse from "../Services/AxeResponse";
import ApiError from "src/Exceptions/ApiError";

const api = APIService.getInstance();

const return404 = (response: ServerResponse) => {
  response.statusCode = 404;
  response.write(JSON.stringify({ error: "Resource not found" }));
  response.end();
};

export default async (request: IncomingMessage, response: ServerResponse) => {
  const axeRequest = new AxeRequest(request);
  const match = URLService.match(axeRequest);
  const axeResponse = new AxeResponse(response, axeRequest.currentLanguage);

  if (!match) {
    return return404(response);
  }

  if (match.customHandler) {
    match.customHandler(axeRequest, axeResponse);
    return;
  }

  // We should set the params
  axeRequest.params = match.params;

  const database = (await IoCService.use("Database")) as Knex;

  // Prepare the database by the transaction option
  let trx: Knex.Transaction | null = null;
  if (match.hasTransaction) {
    trx = await database.transaction();
  }

  const pack: IRequestPack = {
    ...match.data,
    params: match.params,
    api,
    req: axeRequest,
    res: axeResponse,
    database: match.hasTransaction && trx ? trx : database,
  };

  response.setHeader("Content-Type", "application/json");
  response.setHeader("x-powered-by", "Axe API");

  for (const phase of match.phases) {
    // If there is an non-async phase, it should be an Event function
    if (phase.isAsync === false) {
      await phase.callback(pack);
      continue;
    }

    // Middleware and hook calls
    try {
      await phase.callback(pack);
    } catch (error: any) {
      // Rollback transaction
      if (match.hasTransaction && trx) {
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
    if (pack.res.isResponded() === false) {
      continue;
    }

    // If the response is an error, and we have an active transaction,
    // we should rollback it before the HTTP request end.
    if (pack.res.statusCode() >= 400 && pack.res.statusCode() < 599) {
      if (match.hasTransaction && trx) {
        trx.rollback();
      }
      break;
    }

    // If there is a valid transaction, we should commit it
    if (match.hasTransaction && trx) {
      trx.commit();
    }

    // We should brake the for-loop
    break;
  }
};
