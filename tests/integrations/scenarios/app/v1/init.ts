import cors from "cors";
import {
  App,
  AxeRequest,
  AxeResponse,
  createRateLimitMiddleware,
} from "axe-api";
import { IncomingMessage, ServerResponse } from "http";

const onBeforeInit = async (app: App) => {
  app.use(
    cors({
      origin: true,
    }),
  );
  app.get("/health/before", async (req: AxeRequest, res: AxeResponse) => {
    res.json({ health: true });
  });

  const curstomRateLimit = (
    req: IncomingMessage,
    res: ServerResponse,
    next: any,
  ) =>
    createRateLimitMiddleware(req, res, next, "key", {
      maxRequests: 1,
      windowInSeconds: 10,
    });

  app.get(
    "/api/v1/custom-rate-limit",
    curstomRateLimit,
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
