import cors from "cors";
import { App } from "axe-api";

const onBeforeInit = async (app: App) => {
  app.use(
    cors({
      origin: true,
    })
  );
  app.get("/health/before", async (req, res) => {
    res.json({ health: true });
  });
};

const onAfterInit = async (app: App) => {
  app.get("/health/after", async (req, res) => res.json({ health: true }));
};

export { onBeforeInit, onAfterInit };
