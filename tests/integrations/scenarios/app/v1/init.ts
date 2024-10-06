import cors from "cors";
import { App, AxeRequest, AxeResponse, createRateLimitter } from "axe-api";
import { IncomingMessage, ServerResponse } from "http";

const customRateLimitMiddleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: any,
) =>
  createRateLimitter(
    {
      name: "Custom-Limitter",
      clientKey: "test-key",
      setResponseHeaders: true,
      maxRequests: 1,
      windowInSeconds: 5,
    },
    req,
    res,
    next,
  );

const onBeforeInit = async (app: App) => {
  app.use(
    cors({
      origin: true,
    }),
  );
  app.get("/health/before", async (req: AxeRequest, res: AxeResponse) => {
    res.json({ health: true });
  });

  app.get(
    "/api/v1/custom-rate-limit",
    customRateLimitMiddleware,
    async (req: AxeRequest, res: AxeResponse) => {
      res.json({ health: true });
    },
  );
};

const onAfterInit = async (app: App) => {
  app.get("/health/after", async (req: AxeRequest, res: AxeResponse) =>
    res.json({ health: true }),
  );
};

export { onBeforeInit, onAfterInit };
