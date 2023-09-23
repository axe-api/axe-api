import { IContext } from "../../Interfaces";
import { putCache, toCacheTagKey } from "../../Handlers/Helpers";

export default async (context: IContext) => {
  const { result, res, model, handlerType } = context;

  // Adding cache tags
  const { primaryKey } = model.instance;
  const config = model.getCacheConfiguration(handlerType);
  context.req.original.tags.push(
    ...result.data.map((i: any) => toCacheTagKey(model, i[primaryKey], config)),
  );

  // Caching the results
  await putCache(context, result);

  res.json(result);
};
