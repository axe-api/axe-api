import Validator from "validatorjs";
import { IRequestPack, IHookParameter } from "../Interfaces";
import {
  getMergedFormData,
  addForeignKeyQuery,
  serializeData,
  filterHiddenFields,
  bindTimestampValues,
  callHooks,
  addSoftDeleteQuery,
} from "./Helpers";
import {
  HandlerTypes,
  HookFunctionTypes,
  HttpMethods,
  TimestampColumns,
} from "../Enums";
import ApiError from "../Exceptions/ApiError";
import { Knex } from "knex";

export default async (pack: IRequestPack) => {
  const { version, model, req, res, database, relation, parentModel } = pack;

  const query = (database as Knex).from(model.instance.table);

  // If there is a relation, we should bind it
  addForeignKeyQuery(req, query, relation, parentModel);

  // If there is a deletedAtColumn, it means that this table support soft-delete
  addSoftDeleteQuery(model, null, query);

  await callHooks(model, HookFunctionTypes.onBeforeUpdateQuery, {
    ...pack,
    query,
  } as unknown as IHookParameter);

  let item = await query
    .where(model.instance.primaryKey, req.params[model.instance.primaryKey])
    .first();

  if (!item) {
    throw new ApiError(`The item is not found on ${model.name}.`);
  }

  await callHooks(model, HookFunctionTypes.onAfterUpdateQuery, {
    ...pack,
    item,
    query,
  } as unknown as IHookParameter);

  const requestMethod: HttpMethods = req.method as unknown as HttpMethods;
  const fillables = model.instance.getFillableFields(requestMethod);
  const formData = getMergedFormData(req, fillables);
  const validationRules = model.instance.getValidationRules(requestMethod);
  if (validationRules) {
    // The validation language should be set
    Validator.useLang(req.currentLanguage.language);

    // Validate the data
    const validation = new Validator(formData, validationRules);
    if (validation.fails()) {
      return res.status(400).json(validation.errors);
    }
  }

  // We should bind the timestamp values
  bindTimestampValues(formData, [TimestampColumns.UPDATED_AT], model);

  await callHooks(model, HookFunctionTypes.onBeforeUpdate, {
    ...pack,
    item,
    formData,
    query,
  } as unknown as IHookParameter);

  await query
    .where(model.instance.primaryKey, item[model.instance.primaryKey])
    .update(formData);

  item = await database(model.instance.table)
    .where(model.instance.primaryKey, item[model.instance.primaryKey])
    .first();

  await callHooks(model, HookFunctionTypes.onAfterUpdate, {
    ...pack,
    item,
    formData,
    query,
  } as unknown as IHookParameter);

  // Serializing the data by the model's serialize method
  item = await serializeData(
    version,
    item,
    model.serialize,
    HandlerTypes.UPDATE,
    req
  );

  // Filtering hidden fields from the response data.
  filterHiddenFields([item], model.instance.hiddens);

  return res.json(item);
};
