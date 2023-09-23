import { IoCService, LogService } from "../Services";
import { toCacheKey } from "../Handlers/Helpers";
import { IContext } from "../Interfaces";
import RedisAdaptor from "../Middlewares/RateLimit/RedisAdaptor";

export default async (context: IContext) => {
  // Getting the correct configuration
  const { model, handlerType } = context;
  const config = model.getCacheConfiguration(handlerType);

  // Check if the cache enable for this handler
  if (config?.enable) {
    // Getting the redis service
    const redis = await IoCService.use<RedisAdaptor>("Redis");
    // Generating the cache key
    const key = toCacheKey(context);
    // Try to fetch the value via Redis
    const value = await redis.get(key);
    // Check if there is a value
    if (value) {
      // Parse and respond the value
      const result = JSON.parse(value);
      const { res } = context;

      if (config.responseHeader) {
        res.header(config.responseHeader, "Hit");
      }

      res.json(result);
      // Logging
      LogService.debug(`\t🔄 redis.get(${key})`);
    }
  }
};
