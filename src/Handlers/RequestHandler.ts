import { IncomingMessage, ServerResponse } from "http";
import { APIService, IoCService } from "../Services";
import URLService from "../Services/URLService";
import { IRequestPack } from "../Interfaces";
import { Knex } from "knex";
import AxeRequest from "../Services/AxeRequest";
import AxeResponse from "../Services/AxeResponse";

const return404 = (response: ServerResponse) => {
  response.statusCode = 404;
  response.write(JSON.stringify({ error: "Resource not found" }));
  response.end();
};

export default async (request: IncomingMessage, response: ServerResponse) => {
  const urlService = await IoCService.useByType<URLService>("URLService");
  const axeRequest = new AxeRequest(request);
  const axeResponse = new AxeResponse(response);
  const match = urlService.match(axeRequest);

  if (!match) {
    return return404(response);
  }

  const api = APIService.getInstance();
  const database = (await IoCService.use("Database")) as Knex;

  let trx: Knex.Transaction | null = null;
  if (match.hasTransaction) {
    trx = await database.transaction();
  }

  const pack: IRequestPack = {
    ...match.data,
    api,
    req: axeRequest,
    res: axeResponse,
    database: match.hasTransaction && trx ? trx : database,
  };

  response.setHeader("Content-Type", "application/json");
  response.setHeader("X-Powered-By", "Axe API");

  for (const phase of match.phases) {
    // If there is an non-async phase, it should be an Event function
    if (!phase.isAsync) {
      await phase.callback(pack);
      continue;
    }

    // Middleware and hook calls
    await phase.callback(pack);

    // If the response is not created, we should go to the next phase
    if (!pack.res.isResponded()) {
      continue;
    }

    // If the response is an error, and we have an active transaction,
    // we should rollback it before the HTTP request end.
    if (pack.res.statusCode() >= 400 || pack.res.statusCode() < 599) {
      if (match.hasTransaction && trx) {
        console.log("rollback");
        trx.rollback();
      }
      continue;
    }

    // If there is a valid transaction, we should commit it
    if (match.hasTransaction && trx) {
      trx.commit();
    }
  }
};
