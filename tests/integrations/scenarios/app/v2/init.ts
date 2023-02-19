import cors from "cors";
import { Express } from "express";

const onBeforeInit = async (app: Express) => {
  app.use(
    cors({
      origin: true,
    })
  );
};

const onAfterInit = async () => {
  // TODO:
};

export { onBeforeInit, onAfterInit };
