import {
  getFormData,
  getFormValidation,
  callHooks,
  filterHiddenFields,
  bindTimestampValues,
  serializeData,
  addForeignKeyQuery,
} from "./helpers.js";
import Validator from "validatorjs";
import { HOOK_FUNCTIONS, TIMESTAMP_COLUMNS } from "./../constants.js";
import HttpResponse from "./../core/HttpResponse.js";

export default async (context) => {
  const { request, response, model, database, relation, parentModel } = context;

  const query = database.from(model.instance.table);

  // If there is a relation, we should bind it
  addForeignKeyQuery(request, query, relation, parentModel);

  await callHooks(model, HOOK_FUNCTIONS.onBeforeUpdateQuery, {
    ...context,
    query,
  });

  let item = await query
    .where(model.instance.primaryKey, request.params[model.instance.primaryKey])
    .first();
  if (!item) {
    throw new HttpResponse(404, `The item is not found on ${model.name}.`);
  }

  await callHooks(model, HOOK_FUNCTIONS.onAfterUpdateQuery, {
    ...context,
    item,
    query,
  });

  const formData = getFormData(request, model.instance.fillable);

  const formValidationRules = getFormValidation(
    request.method,
    model.instance.validations
  );

  if (formValidationRules) {
    const validation = new Validator(formData, formValidationRules);
    if (validation.fails()) {
      return response.status(400).json(validation.errors);
    }
  }

  // We should bind the timestamp values
  bindTimestampValues(formData, [TIMESTAMP_COLUMNS.UPDATED_AT], model);

  await callHooks(model, HOOK_FUNCTIONS.onBeforeUpdate, {
    ...context,
    item,
    formData,
    query,
  });

  await query
    .where(model.instance.primaryKey, item[model.instance.primaryKey])
    .update(formData);
  item = await database(model.instance.table)
    .where(model.instance.primaryKey, item[model.instance.primaryKey])
    .first();

  await callHooks(model, HOOK_FUNCTIONS.onAfterUpdate, {
    ...context,
    item,
    formData,
    query,
  });

  // Serializing the data by the model's serialize method
  item = serializeData(item, model.instance.serialize);

  // Filtering hidden fields from the response data.
  filterHiddenFields([item], model.instance.hiddens);

  return response.json(item);
};
