import {
  getFormData,
  getFormValidation,
  callHooks,
  getParentColumn,
  filterHiddenFields,
} from "./helpers.js";
import Validator from "validatorjs";
import { HOOK_FUNCTIONS } from "./../Constants.js";
import ApiError from "./../Exceptions/ApiError.js";

export default async (pack) => {
  const { request, response, model, database, relation, parentModel } = pack;

  const query = database.from(model.instance.table);

  // If there is a relation, we should bind it
  if (relation && parentModel) {
    const parentColumn = getParentColumn(request);
    query.where(relation.foreignKey, request.params[parentColumn]);
  }

  await callHooks(model, HOOK_FUNCTIONS.onBeforeUpdateQuery, {
    ...pack,
    query,
  });

  let item = await query.where("id", request.params.id).first();
  if (!item) {
    throw new ApiError(404, `The item is not found on ${model.name}.`);
  }

  await callHooks(model, HOOK_FUNCTIONS.onAfterUpdateQuery, {
    ...pack,
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

  await callHooks(model, HOOK_FUNCTIONS.onBeforeUpdate, {
    ...pack,
    item,
    formData,
    query,
  });

  await query.where("id", item.id).update(formData);
  item = await database(model.instance.table).where("id", item.id).first();

  await callHooks(model, HOOK_FUNCTIONS.onAfterUpdate, {
    ...pack,
    item,
    formData,
    query,
  });

  // Filtering hidden fields from the response data.
  filterHiddenFields([item], model.instance.hiddens);

  return response.json(item);
};
