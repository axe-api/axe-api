import { FolderResolver, FileResolver, ModelResolver } from "./Resolvers";
import { IApplicationConfig, IConfig, IFolders } from "./Interfaces";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import knex from "knex";
import schemaInspector from "knex-schema-inspector";
import { attachPaginate } from "knex-paginate";
import { ModelTreeBuilder, RouterBuilder } from "./Builders";
import HandlerFactory from "./Handlers/HandlerFactory";
import {
  DocumentationService,
  LogService,
  IoCService,
  SchemaValidatorService,
} from "./Services";

class Server {
  async start(appFolder: string) {
    dotenv.config();
    const folders = new FolderResolver().resolve(appFolder);
    const fileResolver = new FileResolver();
    const config = await fileResolver.resolve<IConfig>(folders.Config);
    const models = await fileResolver.resolve<IConfig>(folders.Models);
    await this.bindDependencies(folders, config, models);
    await this.loadExpress();
    await this.analyzeModels();
    await this.listen();
  }

  private async bindDependencies(
    folders: IFolders,
    config: Record<string, IConfig>,
    models: Record<string, IConfig>
  ) {
    IoCService.singleton("Folders", () => folders);
    IoCService.singleton("Config", () => config);
    IoCService.singleton("Models", () => models);
    IoCService.singleton("SchemaInspector", () => schemaInspector);
    IoCService.singleton("Database", async () => {
      const config = await IoCService.use("Config");
      const database = knex(config.Database);
      attachPaginate();
      return database;
    });
    IoCService.singleton("App", async () => {
      return express();
    });
    IoCService.singleton("HandlerFactory", () => {
      return new HandlerFactory();
    });

    IoCService.singleton(
      "DocumentationService",
      async () => new DocumentationService()
    );
    IoCService.singleton("LogService", async () => {
      const config = await IoCService.use("Config");
      return new LogService(
        (config.Application as IApplicationConfig).logLevel
      );
    });
  }

  private async loadExpress() {
    const app = await IoCService.use("App");
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
  }

  private async analyzeModels() {
    await new ModelResolver().resolve();
    await new SchemaValidatorService().validate();
    await new ModelTreeBuilder().build();
    await new RouterBuilder().build();
  }

  private async listen() {
    const config = await IoCService.use("Config");
    const app = await IoCService.use("App");
    const logger = await IoCService.useByType<LogService>("LogService");

    if (config.Application.env === "development") {
      app.get("/docs", async (req: Request, res: Response) => {
        const docs = await IoCService.useByType<DocumentationService>(
          "DocumentationService"
        );
        const modelTree = await IoCService.use("ModelTree");
        res.json({
          routes: docs.get(),
          modelTree,
        });
      });
      app.get("/docs/routes", async (req: Request, res: Response) => {
        const docs = await IoCService.useByType<DocumentationService>(
          "DocumentationService"
        );
        res.json(docs.get().map((route) => `${route.method} ${route.url}`));
      });
    }

    app.listen(config.Application.port, () => {
      logger.info(
        `API listens requests on http://localhost:${config.Application.port}`
      );
    });
  }
}

export default Server;
