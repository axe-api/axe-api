import Validator from "validatorjs";
import { HttpMethods, StatusCodes, TimestampColumns } from "../../Enums";
import { IContext } from "../../Interfaces";
import {
  bindTimestampValues,
  getForeignKeyValueErrors,
  getMergedFormData,
} from "../../Handlers/Helpers";

export default async (context: IContext) => {
  const { req, res, model } = context;
  const requestMethod: HttpMethods = req.method as unknown as HttpMethods;
  const fillables = model.instance.getFillableFields(requestMethod);
  context.formData = {
    ...context.item,
    ...getMergedFormData(req, fillables),
  };
  const validationRules = model.instance.getValidationRules(requestMethod);
  if (validationRules) {
    // The validation language should be set
    Validator.useLang(req.currentLanguage.language);

    // Validate the data
    const validation = new Validator(context.formData, validationRules);
    if (validation.fails()) {
      return res.status(StatusCodes.BAD_REQUEST).json(validation.errors);
    }
  }

  // Checking the foreign key values if there is any
  const errors = await getForeignKeyValueErrors(context);
  if (errors.length > 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors });
  }

  // We should bind the timestamp values
  bindTimestampValues(context.formData, model, [TimestampColumns.UPDATED_AT]);
};
