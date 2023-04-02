import { Knex } from "knex";
import { IHttpContext, IHookParameter } from "../Interfaces";
import { addForeignKeyQuery, callHooks } from "./Helpers";
import { HookFunctionTypes } from "../Enums";
import ApiError from "../Exceptions/ApiError";

export default async (pack: IHttpContext) => {
  const { model, req, res, database, relation, parentModel } = pack;

  const query = (database as Knex)
    .from(model.instance.table)
    .where(model.instance.primaryKey, req.params[model.instance.primaryKey]);

  // If there is a deletedAtColumn, it means that this table support soft-delete
  if (model.instance.deletedAtColumn === null) {
    throw new ApiError(
      "You can use force delete only soft-delete supported models."
    );
  }

  // If there is a relation, we should bind it
  addForeignKeyQuery(req, query, relation, parentModel);

  await callHooks(model, HookFunctionTypes.onBeforeForceDeleteQuery, {
    ...pack,
    query,
  } as unknown as IHookParameter);

  const item = await query.first();
  if (!item) {
    throw new ApiError(`The item is not found on ${model.name}.`);
  }

  await callHooks(model, HookFunctionTypes.onAfterForceDeleteQuery, {
    ...pack,
    query,
    item,
  } as unknown as IHookParameter);

  await callHooks(model, HookFunctionTypes.onBeforeForceDelete, {
    ...pack,
    query,
    item,
  } as unknown as IHookParameter);

  await query.delete();

  await callHooks(model, HookFunctionTypes.onAfterForceDelete, {
    ...pack,
    item,
  } as unknown as IHookParameter);

  return res.json();
};
