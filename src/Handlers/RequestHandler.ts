import { IncomingMessage, ServerResponse } from "http";
import { APIService, IoCService } from "../Services";
import URLService from "../Services/URLService";
import { IRequestPack } from "../Interfaces";
import { TransactionResolver } from "../Resolvers";
import { Knex } from "knex";
import AxeRequest from "../Services/AxeRequest";

const return404 = (response: ServerResponse) => {
  response.statusCode = 404;
  response.write(JSON.stringify({ error: "Resource not found" }));
  response.end();
};

const jsonResponse = (response: ServerResponse, data: any) => {
  response.write(JSON.stringify(data));
  response.end();
};

export default async (request: IncomingMessage, response: ServerResponse) => {
  const urlService = await IoCService.useByType<URLService>("URLService");
  const axeRequest = new AxeRequest(request);
  const match = urlService.match(axeRequest);

  if (!match) {
    return return404(response);
  }

  const api = APIService.getInstance();
  const database = (await IoCService.use("Database")) as Knex;

  let trx: Knex.Transaction | null = null;
  let hasTransaction = false;
  hasTransaction = await new TransactionResolver(match.data.version).resolve(
    match.data.model,
    match.data.handlerType
  );
  if (hasTransaction) {
    trx = await database.transaction();
  }

  const pack: IRequestPack = {
    ...match.data,
    api,
    req: axeRequest,
    database: hasTransaction && trx ? trx : database,
  };

  response.setHeader("Content-Type", "application/json");
  response.setHeader("X-Powered-By", "Axe API");

  for (const phase of match.phases) {
    // Middleware and hook calls
    if (phase.isAsync) {
      const result: any = await phase.callback(pack);

      if (result) {
        jsonResponse(response, result);
        return;
      }
    } else {
      // Event calls
      await phase.callback(pack);
    }
  }

  jsonResponse(response, { status: true });
};
