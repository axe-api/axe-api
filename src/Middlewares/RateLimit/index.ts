import { IncomingMessage, ServerResponse } from "http";
import AdaptorFactory from "./AdaptorFactory";
import {
  AxeConfig,
  IRateLimitConfig,
  IRateLimitOptions,
  IRequestPack,
} from "../../Interfaces";
import { APIService, LogService } from "../../Services";
import IAdaptor from "./IAdaptor";
import { nanoid } from "nanoid";
import { StatusCodes } from "../../Enums";

let adaptor: IAdaptor;

interface IRateLimitResponse {
  success: boolean;
  limit: number;
  remaining: number;
}

const checkRateLimit = async function (
  clientKey: string,
  options: IRateLimitOptions
): Promise<IRateLimitResponse> {
  // Getting the last value from cache
  const reply = await adaptor.get(clientKey);

  if (!reply) {
    // First request from this IP, set initial values
    await adaptor.set(
      clientKey,
      (options.maxRequests - 1).toString(),
      options.windowInSeconds
    );
    return {
      success: true,
      limit: options.maxRequests,
      remaining: options.maxRequests - 1,
    };
  }

  // Is there any remaining request right
  const remainingRequests = parseInt(reply);
  if (remainingRequests > 0) {
    // Set the new value to the cache
    await adaptor.decr(clientKey, options.windowInSeconds);
    return {
      success: true,
      limit: options.maxRequests,
      remaining: remainingRequests - 1,
    };
  }

  // Client has exceeded rate limit
  return {
    success: false,
    limit: options.maxRequests,
    remaining: 0,
  };
};

const getClientKeyByConfigurations = (
  req: IncomingMessage,
  config: IRateLimitConfig | undefined
): string => {
  if (config?.keyGenerator) {
    return config?.keyGenerator(req);
  }

  if (config?.trustProxyIP) {
    // Getting the x-forwarded-for value for the Proxy servers.
    let headerValue = req.headers["x-forwarded-for"];
    if (Array.isArray(headerValue)) {
      headerValue = headerValue[0];
    }
    return `axe-api-rate-limit:${headerValue || ""}`;
  }

  return `axe-api-rate-limit:${req.socket.remoteAddress || ""}`;
};

export const setupRateLimitAdaptors = (config: AxeConfig) => {
  // Creating the correct adaptor by the configuration
  adaptor = AdaptorFactory(
    config.rateLimit?.adaptor.type || "memory",
    config.rateLimit?.adaptor.redis,
    ""
  );
};

/**
 * Add a rate limit with the `IRateLimitOptions`
 *
 * @param options
 * @returns
 * @example
 *  class User extends Model {
 *    get middlewares() {
 *      return [
 *        {
 *          handler: [HandlerTypes.INSERT],
 *          middleware: rateLimit({ maxRequests: 200, windowInSeconds: 5 }),
 *        },
 *      ];
 *    }
 *  }
 */
export const rateLimit = (options?: IRateLimitOptions) => {
  // For each model middleware, we should use a different ID for the cache key
  const id = nanoid();

  return async (context: IRequestPack) => {
    // API configuration fetching
    const api = APIService.getInstance();

    // Creating a clientkey by the client key configurations
    const clientKey = getClientKeyByConfigurations(
      context.req.original,
      api.config.rateLimit
    );

    // Developers are able to set different rate limit options
    // in model files. That's why we should create a new option object.
    const selectedOptions: IRateLimitConfig = {
      ...api.config.rateLimit,
      ...options,
    };

    // Checking the rate limit
    const isAllowed = await checkRateLimit(
      `${clientKey}:${id}`,
      selectedOptions
    );

    // Setting the headers
    context.res.original.setHeader("X-RateLimit-Limit", isAllowed.limit);
    context.res.original.setHeader(
      "X-RateLimit-Remaining",
      isAllowed.remaining
    );

    // Sending an error message if there is an error
    if (isAllowed.success === false) {
      LogService.warn(`Rate limit exceeded: ${context.req.url}`);
      context.res
        .status(StatusCodes.TOO_MANY_REQUESTS)
        .json({ error: "Rate limit exceeded." });
    }
  };
};

export default async (req: IncomingMessage, res: ServerResponse, next: any) => {
  const api = APIService.getInstance();

  // Generating the client key
  const clientKey = getClientKeyByConfigurations(req, api.config.rateLimit);

  // Checking the rate limits.
  const isAllowed = await checkRateLimit(clientKey, {
    maxRequests: api.config.rateLimit.maxRequests,
    windowInSeconds: api.config.rateLimit.windowInSeconds,
  });

  // Setting the HTTP Response headers.
  res.setHeader("X-RateLimit-Limit", isAllowed.limit);
  res.setHeader("X-RateLimit-Remaining", isAllowed.remaining);

  // If it is allowed, the next function would be called.
  if (isAllowed.success) {
    return next();
  }

  // Sending an error message.
  LogService.warn(`Rate limit exceeded: ${req.url}`);
  res.writeHead(429, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      error: "Rate limit exceeded.",
    })
  );
};
