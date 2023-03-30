import path from "path";
import { Frameworks, LogLevels } from "../Enums";
import { IAPI, IApplicationConfig, IVersion } from "../Interfaces";
import ModelListService from "./ModelListService";

class APIService {
  private folders: IAPI;
  private static instance: APIService;

  constructor(rootFolder: string) {
    this.folders = {
      rootFolder: rootFolder,
      appFolder: path.join(rootFolder, "app"),
      versions: [],
      config: {
        env: "production",
        port: 3000,
        logLevel: LogLevels.INFO,
        prefix: "/api",
        framework: Frameworks.Fastify, // FIXME: dinamik olarak framework okunmalı
        database: {},
      },
    };
  }

  static getInstance(): APIService {
    return APIService.instance;
  }

  static setInsance(rootFolder: string) {
    if (APIService.instance) {
      throw new Error(`The instance already created: ${APIService.name}`);
    }

    APIService.instance = new APIService(rootFolder);
  }

  get rootFolder() {
    return this.folders.rootFolder;
  }

  get appFolder() {
    return this.folders.appFolder;
  }

  get versions() {
    return this.folders.versions;
  }

  get config(): IApplicationConfig {
    return this.folders.config;
  }

  setConfig(config: IApplicationConfig) {
    this.folders.config = config;
  }

  addVersion(name: string) {
    const root = path.join(this.folders.appFolder, name);
    this.folders.versions.push({
      name,
      config: {
        transaction: [],
        serializers: [],
        supportedLanguages: ["en"],
        defaultLanguage: "en",
        query: {
          limits: [],
        },
      },
      folders: {
        root,
        config: path.join(root, "Config"),
        events: path.join(root, "Events"),
        hooks: path.join(root, "Hooks"),
        middlewares: path.join(root, "Middlewares"),
        models: path.join(root, "Models"),
        serialization: path.join(root, "Serialization"),
      },
      modelList: new ModelListService([]),
      modelTree: [],
    });
  }

  getVersion(name: string): IVersion {
    const version = this.folders.versions.find((i) => i.name === name);
    if (!version) {
      throw new Error(`Undefined version: ${version}`);
    }

    return version;
  }
}

export default APIService;
