import dotenv from "dotenv";
import express from "express";
import {
  getModels,
  createModelTree,
  setRoutes,
} from "./Helpers/ModelHelpers.js";
import BaseController from "./Controller/BaseController.js";
import { getDatabaseInstance } from "./Helpers/DatabaseHelpers.js";
import Config from "./Helpers/ConfigHelpers.js";
import IoC from "./Core/IoC.js";

class Server {
  constructor(appFolder) {
    this.appFolder = appFolder;
  }

  async listen() {
    await this._bindDependencies();
    await this._loadConfigurations();
    await this._loadExpress();
  }

  async _bindDependencies() {
    IoC.singleton("Config", () => new Config());
    IoC.singleton("Database", async () => {
      const Config = await IoC.use("Config");
      return getDatabaseInstance(Config.Database);
    });
    IoC.singleton("Controller", async () => {
      return new BaseController();
    });
    IoC.singleton("App", async () => {
      return express();
    });
  }

  async _loadConfigurations() {
    dotenv.config();
    const Config = await IoC.use("Config");
    await Config.load(this.appFolder);
  }

  async _loadExpress() {
    const App = await IoC.use("App");
    this.instances = await getModels(this.appFolder);
    await setRoutes(createModelTree(this.instances));

    App.get("/", (req, res) => {
      res.json({
        name: "AXE API",
        description: "The best API creation tool in the world.",
        aim: "To kill them all!",
      });
    });

    const Config = await IoC.use("Config");

    App.listen(Config.Application.port, () => {
      console.log(
        `Example app listening at http://localhost:${Config.Application.port}`
      );
    });
  }
}

export default Server;
