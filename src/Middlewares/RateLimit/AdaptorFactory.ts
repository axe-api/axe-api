import { AdaptorTypes } from "../../Types";
import RedisAdaptor from "./RedisAdaptor";
import MemoryAdaptor from "./MemoryAdaptor";
import { IRedisOptions } from "src/Interfaces";

export default (
  adaptor: AdaptorTypes,
  redisOptions: IRedisOptions | undefined,
  prefix: string
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
