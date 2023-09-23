import { LogService } from "../../Services";
import { IContext } from "../../Interfaces";
import { Knex } from "knex";
import { putCache, toCachePrefix } from "../../Handlers/Helpers";

export default async (context: IContext) => {
  const { database, isTransactionOpen, item, res, model, handlerType } =
    context;

  // If there is a valid transaction, we should commit it
  if (isTransactionOpen) {
    LogService.warn("\tDB transaction commit");
    (database as Knex.Transaction).commit();
  }

  // Adding cache tags
  const { primaryKey } = model.instance;
  const config = model.getCacheConfiguration(handlerType);
  const tagPrefix = toCachePrefix(config?.tagPrefix);
  context.req.original.tags.push(
    `${tagPrefix}${model.name}:${item[primaryKey]}`,
  );

  // Caching the results
  await putCache(context, item);

  res.json(item);
};
