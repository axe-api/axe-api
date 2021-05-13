import {
  getFormData,
  getFormValidation,
  callHooks,
  getParentColumn,
} from "./helpers.js";
import Validator from "validatorjs";
import { HOOK_FUNCTIONS } from "./../Constants.js";

export default async (pack) => {
  const { request, response, model, database, relation, parentModel } = pack;

  const formData = getFormData(request, model.instance.fillable);
  const formValidationRules = getFormValidation(
    request,
    model.instance.validations
  );

  if (formValidationRules) {
    const validation = new Validator(formData, formValidationRules);
    if (validation.fails()) {
      return response.status(400).json(validation.errors);
    }
  }

  // Binding parent id if there is.
  if (relation && parentModel) {
    const parentColumn = getParentColumn(request);
    formData[relation.foreignKey] = request.params[parentColumn];
  }

  await callHooks(model, HOOK_FUNCTIONS.onBeforeCreate, {
    ...pack,
    formData,
  });

  const [insertId] = await database(model.instance.table).insert(formData);
  const item = await database(model.instance.table)
    .where("id", insertId)
    .first();

  await callHooks(model, HOOK_FUNCTIONS.onAfterCreate, {
    ...pack,
    formData,
    item,
  });

  return response.json(item);
};
