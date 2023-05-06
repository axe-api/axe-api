import { Knex } from 'knex';
import { IRequestPack, IHookParameter } from '../Interfaces';
import { addForeignKeyQuery, callHooks, addSoftDeleteQuery } from './Helpers';
import { HookFunctionTypes } from '../Enums';
import ApiError from '../Exceptions/ApiError';

export default async (pack: IRequestPack) => {
  const { model, req, res, database, relation, parentModel } = pack;

  const query = (database as Knex)
    .from(model.instance.table)
    .where(model.instance.primaryKey, req.params[model.instance.primaryKey]);

  // If there is a deletedAtColumn, it means that this table support soft-delete
  addSoftDeleteQuery(model, null, query);

  // If there is a relation, we should bind it
  addForeignKeyQuery(req, query, relation, parentModel);

  await callHooks(model, HookFunctionTypes.onBeforeDeleteQuery, {
    ...pack,
    query,
  } as unknown as IHookParameter);

  const item = await query.first();
  if (!item) {
    throw new ApiError(`The item is not found on ${model.name}.`);
  }

  await callHooks(model, HookFunctionTypes.onAfterDeleteQuery, {
    ...pack,
    query,
    item,
  } as unknown as IHookParameter);

  await callHooks(model, HookFunctionTypes.onBeforeDelete, {
    ...pack,
    query,
    item,
  } as unknown as IHookParameter);

  // If there is a deletedAtColumn, it means that this table support soft-delete
  if (model.instance.deletedAtColumn) {
    await query.update({
      [model.instance.deletedAtColumn]: new Date(),
    });
  } else {
    await query.delete();
  }

  await callHooks(model, HookFunctionTypes.onAfterDelete, {
    ...pack,
    item,
  } as unknown as IHookParameter);

  return res.json();
};
