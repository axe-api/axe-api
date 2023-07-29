import { IncomingMessage, ServerResponse } from "http";
import { APIService, IoCService } from "../Services";
import URLService from "../Services/URLService";
import { IRequestPack } from "../Interfaces";
import { TransactionResolver } from "../Resolvers";
import { Knex } from "knex";

const return404 = (response: ServerResponse) => {
  response.statusCode = 404;
  response.write(JSON.stringify({ error: "Resource not found" }));
  response.end();
};

const jsonResponse = (response: ServerResponse, data: any) => {
  response.write(JSON.stringify(data));
  response.end();
};

class HttpError {}

type Pipeline = (pack: IRequestPack) => Promise<undefined | HttpError>;

const example1: Pipeline = async () => {
  console.log("example");
  return new Promise((resolve) => setTimeout(resolve, 1));
};

const example2: Pipeline = async () => {
  return new HttpError();
};

export default async (request: IncomingMessage, response: ServerResponse) => {
  const urlService = await IoCService.useByType<URLService>("URLService");
  const { method, url } = request;
  const match = urlService.match(method, url);

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

  const items: Pipeline[] = [
    example1,
    example1,
    example1,
    example2,
    example1,
    example1,
  ];

  const pack: IRequestPack = {
    ...match.data,
    api,
    req: {
      query: "",
      params: {},
      method: "POST",
      body: {},
      currentLanguage: {
        title: "en",
        language: "en",
        region: null,
      },
    },
    database: hasTransaction && trx ? trx : database,
  };

  response.setHeader("Content-Type", "application/json");

  for (const item of items) {
    const result = await item(pack);
    if (result) {
      console.log(result);
      jsonResponse(response, { status: false });
      return;
    }
  }

  jsonResponse(response, { status: true });
};
