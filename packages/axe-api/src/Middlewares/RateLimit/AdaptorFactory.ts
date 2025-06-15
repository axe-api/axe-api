import { AdaptorType } from "../../Types";
import RedisAdaptor from "./RedisAdaptor";
import MemoryAdaptor from "./MemoryAdaptor";
import { IoCService } from "../../Services";

export default async (adaptor: AdaptorType) => {
  switch (adaptor) {
    case "redis":
      return await IoCService.use<RedisAdaptor>("Redis");
    case "memory":
      return new MemoryAdaptor();
    default:
      throw new Error(`Adaptor type is not found: ${adaptor}`);
  }
};
