import { AdaptorType } from "../../Types";
import RedisAdaptor from "./RedisAdaptor";
import MemoryAdaptor from "./MemoryAdaptor";
import { RedisClientOptions } from "redis";

export default (
  adaptor: AdaptorType,
  redisOptions: RedisClientOptions | undefined,
  prefix: string,
) => {
  switch (adaptor) {
    case "redis":
      return new RedisAdaptor(redisOptions, prefix);
    case "memory":
      return new MemoryAdaptor(prefix);
    default:
      throw new Error(`Adaptor type is not found: ${adaptor}`);
  }
};
