import Validator from "validatorjs";
import { IRequestPack } from "../../Interfaces";
import {
  bindTimestampValues,
  getMergedFormData,
  getParentColumn,
} from "../../Handlers/Helpers";
import { HttpMethods, StatusCodes, TimestampColumns } from "../../Enums";

export default async (context: IRequestPack) => {
  const requestMethod: HttpMethods = context.req
    .method as unknown as HttpMethods;
  const fillables = context.model.instance.getFillableFields(requestMethod);
  context.formData = getMergedFormData(context.req, fillables);
  const validationRules =
    context.model.instance.getValidationRules(requestMethod);

  if (validationRules) {
    // The validation language should be set
    Validator.useLang(context.req.currentLanguage.language);

    // Validate the data
    const validation = new Validator(context.formData, validationRules);
    if (validation.fails()) {
      context.res.status(StatusCodes.BAD_REQUEST).json(validation.errors);
      return;
    }
  }

  if (context.relation && context.parentModel) {
    const parentColumn = getParentColumn(context.relation);
    if (parentColumn) {
      context.formData[context.relation.foreignKey] =
        context.params[parentColumn];
    }
  }

  // We should bind the timestamp values
  bindTimestampValues(context.formData, context.model, [
    TimestampColumns.CREATED_AT,
    TimestampColumns.UPDATED_AT,
  ]);
};
