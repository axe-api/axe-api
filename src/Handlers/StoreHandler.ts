import Validator from "validatorjs";
import { IRequestPack, IHookParameter } from "../Interfaces";
import {
  getMergedFormData,
  getParentColumn,
  serializeData,
  filterHiddenFields,
  bindTimestampValues,
  callHooks,
} from "./Helpers";
import {
  HandlerTypes,
  HookFunctionTypes,
  HttpMethods,
  TimestampColumns,
} from "../Enums";

export default async (pack: IRequestPack) => {
  const { version, model, req, res, database, relation, parentModel } = pack;

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

  if (relation && parentModel) {
    const parentColumn = getParentColumn(relation);
    if (parentColumn) {
      formData[relation.foreignKey] = req.params[parentColumn];
    }
  }

  // We should bind the timestamp values
  bindTimestampValues(
    formData,
    [TimestampColumns.CREATED_AT, TimestampColumns.UPDATED_AT],
    model
  );

  await callHooks(model, HookFunctionTypes.onBeforeInsert, {
    ...pack,
    formData,
  } as unknown as IHookParameter);

  const [returningResult] = await database(model.instance.table)
    .insert(formData)
    .returning(model.instance.primaryKey);

  let insertedPrimaryKeyValue =
    typeof returningResult === "number"
      ? returningResult
      : returningResult[model.instance.primaryKey];

  // If the user use a special primary key value, we should use that value
  if (insertedPrimaryKeyValue === 0) {
    insertedPrimaryKeyValue = formData[model.instance.primaryKey];
  }

  let item = await database(model.instance.table)
    .where(model.instance.primaryKey, insertedPrimaryKeyValue)
    .first();

  await callHooks(model, HookFunctionTypes.onAfterInsert, {
    ...pack,
    formData,
    item,
  } as unknown as IHookParameter);

  // Serializing the data by the model's serialize method
  item = await serializeData(
    version,
    item,
    model.serialize,
    HandlerTypes.INSERT,
    req
  );

  // Filtering hidden fields from the response data.
  filterHiddenFields([item], model.instance.hiddens);

  return res.json(item);
};
