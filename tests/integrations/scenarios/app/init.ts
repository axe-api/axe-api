import cors from "cors";
import { Express } from "express";

const onBeforeInit = async (app: Express) => {
  app.use(
    cors({
      origin: true,
    })
  );
  app.get("/health/v1", (req, res) => res.json({ health: true }));
};

const onAfterInit = async (app: Express) => {
  app.get("/health/v2", (req, res) => res.json({ health: true }));
};

export { onBeforeInit, onAfterInit };
