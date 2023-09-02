import cors from "cors";
import { App, AxeRequest, AxeResponse } from "axe-api";

const onBeforeInit = async (app: App) => {
  app.use(
    cors({
      origin: true,
    }),
  );
  app.get("/health/before", async (req: AxeRequest, res: AxeResponse) => {
    res.json({ health: true });
  });
};

const onAfterInit = async (app: App) => {
  app.get("/health/after", async (req: AxeRequest, res: AxeResponse) =>
    res.json({ health: true }),
  );
};

export { onBeforeInit, onAfterInit };
