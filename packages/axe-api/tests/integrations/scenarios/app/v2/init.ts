import cors from "cors";
import { App } from "axe-api";

const onBeforeInit = async (app: App) => {
  app.use(
    cors({
      origin: true,
      exposedHeaders: ["X-Axe-API-Cache"],
    }),
  );
};

const onAfterInit = async () => {
  // TODO:
};

export { onBeforeInit, onAfterInit };
