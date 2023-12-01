import {
  ModelResolver,
  VersionConfigResolver,
  VersionResolver,
} from "./Resolvers";
import { IApplicationConfig } from "./Interfaces";
import dotenv from "dotenv";
import path from "path";
import knex from "knex";
import schemaInspector from "knex-schema-inspector";
import { attachPaginate } from "knex-paginate";
import { ModelTreeBuilder, RouterBuilder } from "./Builders";
import {
  LogService,
  IoCService,
  APIService,
  SchemaValidatorService,
} from "./Services";
import MetadataHandler from "./Handlers/MetadataHandler";
import DocsHTMLHandler from "./Handlers/DocsHTMLHandler";
import RoutesHandler from "./Handlers/RoutesHandler";
import http from "http";
import RequestHandler from "./Handlers/RequestHandler";
import App from "./Services/App";

class Server {
  async start(rootFolder: string) {
    dotenv.config();

    try {
      APIService.setInsance(rootFolder);
      await this.loadGeneralConfiguration();
      await this.bindDependencies();
      await this.analyzeVersions();
      await this.listen();
    } catch (error: any) {
      if (error.type === "AxeError") {
        LogService.error(error);
      } else {
        throw error;
      }
    }
  }

  private async bindDependencies() {
    const api = APIService.getInstance();
    IoCService.singleton("SchemaInspector", () => schemaInspector);
    IoCService.singleton("App", () => new App());
    IoCService.singleton("Database", async () => {
      const database = knex(api.config.database);
      LogService.debug("Created a knex connection instance");
      attachPaginate();
      LogService.debug("Added pagination support to the knex");
      return database;
    });
  }

  private async analyzeVersions() {
    const api = APIService.getInstance();
    await new VersionResolver().resolve();

    for (const version of api.versions) {
      await new VersionConfigResolver(version).resolve();
      await new ModelResolver(version).resolve();
      await new SchemaValidatorService(version).validate();
      await new ModelTreeBuilder(version).build();
      await new RouterBuilder(version).build();
    }
  }

  private async loadGeneralConfiguration() {
    const api = APIService.getInstance();
    const generalConfigFile = path.join(api.appFolder, "config");
    const { default: content } = await import(generalConfigFile);
    api.setConfig(content as IApplicationConfig);
    LogService.setInstance(api.config.pino);
    LogService.debug("Configurations are loaded");
  }

  private async listen() {
    const app = await IoCService.useByType<App>("App");

    app.use(RequestHandler);

    const server = http.createServer(app.instance);
    const api = APIService.getInstance();

    server.on("error", function (e) {
      // Handle your error here
      console.log("GENERAL", e);
    });

    if (api.config.env === "development") {
      app.get("/metadata", MetadataHandler);
      app.get("/docs", DocsHTMLHandler);
      app.get("/routes", RoutesHandler);
    }

    server.listen(api.config.port);

    LogService.info(
      `Axe API listens requests on http://localhost:${api.config.port}`
    );
  }
}

export default Server;
