import { IApplicationConfig, LogLevels } from "axe-api";

const config: IApplicationConfig = {
  prefix: "api",
  env: process.env.NODE_ENV || "production",
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000,
  logLevel: LogLevels.INFO,
  transaction: [],
  serializers: [],
  supportedLanguages: ["en", "de"],
  defaultLanguage: "en",
};

export default config;
