import { IContext } from "../../Interfaces";
import { putCache, toCacheTagKey } from "../../Handlers/Helpers";

export default async (context: IContext) => {
  const { item, res, model, handlerType } = context;

  // Adding cache tags
  const { primaryKey } = model.instance;
  const config = model.getCacheConfiguration(handlerType);
  context.req.original.tags.push(
    toCacheTagKey(model, item[primaryKey], config),
  );

  // Caching the results
  await putCache(context, item);

  res.json(item);
};
