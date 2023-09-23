import { IContext } from "../Interfaces";
import { clearCacheTags, toCachePrefix } from "../Handlers/Helpers";

export default async (context: IContext) => {
  const { item, model, handlerType } = context;
  const { primaryKey } = model.instance;
  const config = model.getCacheConfiguration(handlerType);
  const prefix = toCachePrefix(config?.tagPrefix);
  clearCacheTags(`${prefix}${model.name}:${item[primaryKey]}`);
};
