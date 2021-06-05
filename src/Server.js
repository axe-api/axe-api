import dotenv from "dotenv";
import express from "express";
import knex from "knex";
import { attachPaginate } from "knex-paginate";
import Config from "./core/Config.js";
import IoC from "./core/IoC.js";
import Docs from "./core/Docs.js";
import Logger from "./core/Logger.js";
import {
  getModels,
  getModelTree,
  setRelations,
  setHooks,
  setRoutes,
  detectTableColumns,
  checkModelColumns,
} from "./Resolvers/index.js";

class Server {
  constructor(appFolder) {
    this.app = null;
    this.appFolder = appFolder;
    this.models = [];
    this.modelTree = [];
  }

  async listen() {
    await this._bindDependencies();
    await this._loadConfigurations();
    await this._loadExpress();
    await this._analyzeModels();
    await this._listen();
  }

  async _bindDependencies() {
    IoC.singleton("Config", () => new Config());
    IoC.singleton("Database", async () => {
      const Config = await IoC.use("Config");
      const database = knex(Config.Database);
      attachPaginate();
      return database;
    });
    IoC.singleton("App", async () => {
      return express();
    });
    IoC.singleton("Logger", async () => {
      const Config = await IoC.use("Config");
      return new Logger(Config.Application.logLevel);
    });
    IoC.singleton("Docs", async () => new Docs());
    IoC.bind("fs", async () => import("fs"));
    IoC.bind("path", async () => import("path"));
    IoC.bind("url", async () => import("url"));
  }

  async _loadConfigurations() {
    dotenv.config();
    const Config = await IoC.use("Config");
    await Config.load(this.appFolder);
  }

  async _loadExpress() {
    this.app = await IoC.use("App");
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  async _analyzeModels() {
    this.models = await getModels(this.appFolder);
    await setRelations(this.models);
    await detectTableColumns(this.models);
    checkModelColumns(this.models);
    await setHooks("Hooks", this.appFolder, this.models);
    await setHooks("Events", this.appFolder, this.models);
    this.modelTree = await getModelTree(this.models);
    await setRoutes(this.app, this.modelTree, this.appFolder, this.models);
  }

  async _listen() {
    const Config = await IoC.use("Config");

    this.app.get("/", (req, res) => {
      res.json({
        name: "AXE API",
        description: "The best API creation tool in the world.",
        aim: "To kill them all!",
      });
    });

    if (Config.Application.env === "development") {
      this.app.get("/docs", async (req, res) => {
        const docs = await IoC.use("Docs");
        res.json({
          routes: docs.get(),
          modelTree: this.modelTree,
        });
      });

      this.app.get("/docs/routes", async (req, res) => {
        const docs = await IoC.use("Docs");
        res.json(docs.get().map((route) => `${route.method} ${route.url}`));
      });
    }

    this.app.listen(Config.Application.port, () => {
      console.log(
        `Example app listening at http://localhost:${Config.Application.port}`
      );
    });
  }
}

export default Server;
