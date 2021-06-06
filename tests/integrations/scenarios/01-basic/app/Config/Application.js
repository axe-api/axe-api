import { LOG_LEVEL } from "axe-api";

export default async () => {
  return {
    env: process.env.NODE_ENV,
    port: process.env.APP_PORT,
    logLevel: LOG_LEVEL.INFO,
  };
};
