import { App } from "axe-api";
import cors from "cors";

const onBeforeInit = async (app: App) => {
  app.use(
    cors({
      origin: ["http://localhost:5173"],
    })
  );
};

const onAfterInit = async (app: App) => {};

export { onBeforeInit, onAfterInit };
