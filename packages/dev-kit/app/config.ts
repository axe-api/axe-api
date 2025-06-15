import path from "path";
import { IApplicationConfig } from "axe-api";
import ErrorHandler from "./v1/Handlers/ErrorHandler";

const config: IApplicationConfig = {
  prefix: "api",
  env: process.env.NODE_ENV || "production",
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000,
  // hostname: "127.0.0.1",
  errorHandler: ErrorHandler,
  pino: {
    level: "warn",
    transport: {
      target: "pino-pretty",
    },
  },
  validator: "robust-validator",
  disableXPoweredByHeader: false,
  rateLimit: {
    enabled: false,
    adaptor: "memory",
    maxRequests: 5,
    windowInSeconds: 10,
    trustProxyIP: false,
  },
  database: {
    client: process.env.DB_CLIENT || "mysql",
    connection: {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "user",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_DATABASE || "database",
      filename: path.join(process.cwd(), "..", "mydb.sqlite"),
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
