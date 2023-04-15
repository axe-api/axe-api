import { Knex } from "knex";
import { IRequestPack, IHookParameter } from "../Interfaces";
import {
  addForeignKeyQuery,
  callHooks,
  addSoftDeleteQuery,
  checkPrimaryKeyValueType,
} from "./Helpers";
import { HookFunctionTypes } from "../Enums";
import ApiError from "../Exceptions/ApiError";
import { StatusCodes } from "../Enums";

export default async (pack: IRequestPack) => {
  const { model, req, res, database, relation, parentModel } = pack;

  // We should check the parameter type
  const value = req.params[model.instance.primaryKey];
  checkPrimaryKeyValueType(model, value);

  // Adding the main query
  const query = (database as Knex)
    .from(model.instance.table)
    .where(model.instance.primaryKey, value);

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
    throw new ApiError(`The item is not found on ${model.name}.`,StatusCodes.NOT_FOUND);
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
