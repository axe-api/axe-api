import cors from "cors";
import { Express } from "express";

const onBeforeInit = async (app: Express) => {
  app.use(
    cors({
      origin: true,
    })
  );
  app.get("/health/before", (req, res) => res.json({ health: true }));
};

const onAfterInit = async (app: Express) => {
  app.get("/health/after", (req, res) => res.json({ health: true }));
};

export { onBeforeInit, onAfterInit };
