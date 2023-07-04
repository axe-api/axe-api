import { IRequestPack, IHookParameter } from "../Interfaces";
import {
  addForeignKeyQuery,
  getRelatedData,
  serializeData,
  filterHiddenFields,
  callHooks,
  addSoftDeleteQuery,
  checkPrimaryKeyValueType,
} from "./Helpers";
import { HandlerTypes, HookFunctionTypes } from "../Enums";
import ApiError from "../Exceptions/ApiError";
import { QueryService } from "../Services";
import { Knex } from "knex";
import { StatusCodes } from "../Enums";

export default async (pack: IRequestPack) => {
  const { version, model, req, res, database, relation, parentModel } = pack;

  const queryParser = new QueryService(
    model,
    version.modelList.get(),
    version.config
  );

  // We should parse URL query string to use as condition in Lucid query
  const conditions = queryParser.get(req.query);

  // Fetching item
  const query = (database as Knex).from(model.instance.table);

  // If there is a deletedAtColumn, it means that this table support soft-delete
  addSoftDeleteQuery(model, conditions, query);

  // Users should be able to select some fields to show.
  queryParser.applyFields(query, conditions.fields);

  // If there is a relation, we should bind it
  addForeignKeyQuery(req, query, relation, parentModel);

  // We should check the parameter type
  const value = req.params[model.instance.primaryKey];
  checkPrimaryKeyValueType(model, value);

  // Adding the main query
  query.where(model.instance.primaryKey, value);

  await callHooks(model, HookFunctionTypes.onBeforeShow, {
    ...pack,
    query,
    conditions,
  } as unknown as IHookParameter);

  // Users should be able to filter records
  queryParser.applyWheres(query, conditions.q);

  let item = await query.first();
  if (!item) {
    throw new ApiError(
      `The item is not found on ${model.name}.`,
      StatusCodes.NOT_FOUND
    );
  }

  // We should try to get related data if there is any
  await getRelatedData(
    version,
    [item],
    conditions.with,
    model,
    version.modelList,
    database,
    HandlerTypes.ALL,
    req
  );

  await callHooks(model, HookFunctionTypes.onAfterShow, {
    ...pack,
    query,
    conditions,
    item,
  } as unknown as IHookParameter);

  // Serializing the data by the model's serialize method
  item = await serializeData(
    version,
    item,
    model.serialize,
    HandlerTypes.SHOW,
    req
  );

  // Filtering hidden fields from the response data.
  filterHiddenFields([item], model.instance.hiddens);

  return res.json(item);
};
