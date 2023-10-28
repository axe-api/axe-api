import Validator from "validatorjs";
import { HttpMethods, TimestampColumns } from "../../Enums";
import { IRequestPack } from "../../Interfaces";
import { bindTimestampValues, getMergedFormData } from "../../Handlers/Helpers";

export default async (context: IRequestPack) => {
  const requestMethod: HttpMethods = context.req
    .method as unknown as HttpMethods;
  const fillables = context.model.instance.getFillableFields(requestMethod);
  context.formData = {
    ...context.item,
    ...getMergedFormData(context.req, fillables),
  };
  const validationRules =
    context.model.instance.getValidationRules(requestMethod);
  if (validationRules) {
    // The validation language should be set
    Validator.useLang(context.req.currentLanguage.language);

    // Validate the data
    const validation = new Validator(context.formData, validationRules);
    if (validation.fails()) {
      return context.res.status(400).json(validation.errors);
    }
  }

  // We should bind the timestamp values
  bindTimestampValues(context.formData, context.model, [
    TimestampColumns.UPDATED_AT,
  ]);
};
