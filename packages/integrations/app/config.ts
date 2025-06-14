import { IApplicationConfig } from "axe-api";

const config: IApplicationConfig = {
  prefix: "api",
  env: process.env.NODE_ENV || "production",
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000,
  pino: {
    level: "debug",
    transport: {
      target: "pino-pretty",
    },
  },
  rateLimit: {
    enabled: true,
    maxRequests: 10000,
    windowInSeconds: 5,
    trustProxyIP: false,
    adaptor: "memory",
  },
  database: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: parseInt(process.env.DB_PORT || "3000"),
      filename: "./axedb.sql",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  cache: {
    enable: false,
  },
  elasticSearch: {
    node: "http://127.0.0.1:9201",
  },
  search: {
    indexPrefix: "axe",
  },
};

export default config;
