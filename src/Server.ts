import {
  ModelResolver,
  VersionConfigResolver,
  VersionResolver,
} from "./Resolvers";
import { AxeConfig, IApplicationConfig } from "./Interfaces";
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
import { DEFAULT_APP_CONFIG } from "./constants";

class Server {
  /**
   * Start the application with the rootFolder.
   *
   * @param rootFolder
   */
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
    // Getting configuration file path
    const generalConfigFile = path.join(api.appFolder, "config");

    // Loading the configurations
    const { default: content } = await import(generalConfigFile);

    // Merge the configuration with the default configurations
    const apiConfiguration: AxeConfig = {
      ...DEFAULT_APP_CONFIG,
      ...(content as IApplicationConfig),
    };

    // Setting the configurations
    api.setConfig(apiConfiguration);

    // Setting the logger instance
    LogService.setInstance(api.config.pino);
    LogService.debug("Configurations are loaded");
  }

  private async listen() {
    const app = await IoCService.use<App>("App");
    const api = APIService.getInstance();

    // Adding the default handler for auto-created routes
    app.use(RequestHandler);

    // Setting the error handler
    app.use(api.config.errorHandler);

    const server = http.createServer(app.instance);

    server.on("error", function (e) {
      LogService.error(e.message);
    });

    if (api.config.docs) {
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
