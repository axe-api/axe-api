import { IContext } from "../Interfaces";
import { clearCacheTags, toCacheTagKey } from "../Handlers/Helpers";

export default async (context: IContext) => {
  const { item, model, handlerType } = context;
  const { primaryKey } = model.instance;
  const config = model.getCacheConfiguration(handlerType);
  clearCacheTags(toCacheTagKey(model, item[primaryKey], config));
};
