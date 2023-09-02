import cors from "cors";
import { App } from "axe-api";

const onBeforeInit = async (app: App) => {
  app.use(
    cors({
      origin: true,
    }),
  );
};

const onAfterInit = async () => {
  // TODO:
};

export { onBeforeInit, onAfterInit };
