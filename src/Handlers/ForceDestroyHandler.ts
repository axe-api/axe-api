import { Knex } from "knex";
import { IRequestPack } from "../Interfaces";
import {
  addForeignKeyQuery,
  callHooks,
  checkPrimaryKeyValueType,
} from "./Helpers";
import { StatusCodes, HookFunctionTypes } from "../Enums";
import ApiError from "../Exceptions/ApiError";

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
  if (model.instance.deletedAtColumn === null) {
    throw new ApiError(
      "You can use force delete only soft-delete supported models.",
      StatusCodes.NOT_FOUND
    );
  }

  // If there is a relation, we should bind it
  addForeignKeyQuery(req, query, relation, parentModel);

  await callHooks(model, HookFunctionTypes.onBeforeForceDeleteQuery, {
    ...pack,
    query,
  } as unknown as IRequestPack);

  const item = await query.first();
  if (!item) {
    throw new ApiError(`The item is not found on ${model.name}.`);
  }

  await callHooks(model, HookFunctionTypes.onAfterForceDeleteQuery, {
    ...pack,
    query,
    item,
  } as unknown as IRequestPack);

  await callHooks(model, HookFunctionTypes.onBeforeForceDelete, {
    ...pack,
    query,
    item,
  } as unknown as IRequestPack);

  await query.delete();

  await callHooks(model, HookFunctionTypes.onAfterForceDelete, {
    ...pack,
    item,
  } as unknown as IRequestPack);

  return res.status(204).json();
};
