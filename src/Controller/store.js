import {
  getFormData,
  getFormValidation,
  callHooks,
  getParentColumn,
  filterHiddenFields,
  bindTimestampValues,
  serializeData,
} from "./helpers.js";
import Validator from "validatorjs";
import { HOOK_FUNCTIONS, TIMESTAMP_COLUMNS } from "./../Constants.js";

export default async (pack) => {
  const { request, response, model, database, relation, parentModel } = pack;

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

  // Binding parent id if there is.
  if (relation && parentModel) {
    const parentColumn = getParentColumn(request);
    formData[relation.foreignKey] = request.params[parentColumn];
  }

  // We should bind the timestamp values
  bindTimestampValues(
    formData,
    [TIMESTAMP_COLUMNS.CREATED_AT, TIMESTAMP_COLUMNS.UPDATED_AT],
    model
  );

  await callHooks(model, HOOK_FUNCTIONS.onBeforeInsert, {
    ...pack,
    formData,
  });

  let [insertedPrimaryKeyValue] = await database(model.instance.table).insert(
    formData
  );

  // If the user use a special primary key value, we should use that value
  if (insertedPrimaryKeyValue === 0) {
    insertedPrimaryKeyValue = formData[model.instance.primaryKey];
  }

  let item = await database(model.instance.table)
    .where(model.instance.primaryKey, insertedPrimaryKeyValue)
    .first();

  await callHooks(model, HOOK_FUNCTIONS.onAfterInsert, {
    ...pack,
    formData,
    item,
  });

  // Serializing the data by the model's serialize method
  item = serializeData(item, model.instance.serialize);

  // Filtering hidden fields from the response data.
  filterHiddenFields([item], model.instance.hiddens);

  return response.json(item);
};
