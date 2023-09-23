import { Knex } from "knex";
import { IContext } from "../../Interfaces";
import { LogService } from "../../Services";
import { putCache, toCachePrefix } from "../../Handlers/Helpers";

export default async (context: IContext) => {
  const { database, isTransactionOpen, result, res, model, handlerType } =
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
    ...result.data.map(
      (i: any) => `${tagPrefix}${model.name}:${i[primaryKey]}`,
    ),
  );

  // Caching the results
  await putCache(context, result);

  res.json(result);
};
