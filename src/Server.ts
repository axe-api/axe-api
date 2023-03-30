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
import { Frameworks } from "./Enums";
import ExpressFramework from "./Frameworks/ExpressFramework";
import FastifyFramework from "./Frameworks/FastifyFramework";
import DocsHandler from "./Handlers/DocsHandler";
import RoutesHandler from "./Handlers/RoutesHandler";
import { consoleAxeError } from "./Helpers";

class Server {
  async start(rootFolder: string) {
    dotenv.config();

    try {
      await this.bindDependencies(rootFolder);
      await this.loadGeneralConfiguration();
      await this.loadFramework();
      await this.analyzeVersions();
      await this.listen();
    } catch (error: any) {
      if (error.type === "AxeError") {
        consoleAxeError(error);
      } else {
        throw error;
      }
    }
  }

  private async bindDependencies(rootFolder: string) {
    APIService.setInsance(rootFolder);
    const api = APIService.getInstance();
    LogService.setInstance(api.config.logLevel);

    IoCService.singleton("Framework", async () => {
      let framework = null, f = null;
      const frameworkName = api.config.framework;
      switch (frameworkName) {
        case Frameworks.Fastify:
          f = (await import('fastify')).default;
          framework = new FastifyFramework(f);
          break;
        default:
        case Frameworks.Express:
          // Express is default fremework
          f = (await import('express')).default;
          framework = new ExpressFramework(f);
      }
      return framework;
    });
    IoCService.singleton("App", async () => await IoCService.use("Framework"));
    IoCService.singleton("SchemaInspector", () => schemaInspector);
    IoCService.singleton("Database", async () => {
      const database = knex(api.config.database);
      attachPaginate();
      return database;
    });
  }

  private async loadFramework() {
    const app = await IoCService.use("App");
    const framework = await IoCService.use("Framework");

    // Set global framework middlewares for axe-api
    switch (framework._name) {
      default:
      case Frameworks.Express:
        // eslint-disable-next-line no-case-declarations
        const { urlencoded, json } = await import("express");
        app.use(urlencoded({ extended: true }));
        app.use(json());
        break;
      case Frameworks.Fastify:
        break;
    }
    const logger = LogService.getInstance();
    logger.info(`${app._name} has been initialized`);
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
  }

  private async listen() {
    const app = await IoCService.use("App");
    const logger = LogService.getInstance();
    const api = APIService.getInstance();

    if (api.config.env === "development") {
      app.get("/docs", DocsHandler);
      app.get("/routes", RoutesHandler);
    }

    app.listen(api.config.port, () => {
      logger.info(
        `API listens requests on http://localhost:${api.config.port}`
      );
    });
  }
}

export default Server;
