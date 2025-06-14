import { HttpMethods, StatusCodes, TimestampColumns } from "../../Enums";
import { IContext } from "../../Interfaces";
import {
  bindTimestampValues,
  getForeignKeyValueErrors,
  getMergedFormData,
} from "../../Handlers/Helpers";

export default async (context: IContext) => {
  const { req, res, model, validator } = context;
  const requestMethod: HttpMethods = req.method as unknown as HttpMethods;
  const fillables = model.instance.getFillableFields(requestMethod);
  context.formData = {
    ...context.item,
    ...getMergedFormData(req, fillables),
  };

  // Form validation
  const validatorErrors = await validator.validate(
    req,
    model,
    context.formData,
  );
  if (validatorErrors) {
    return res.status(StatusCodes.BAD_REQUEST).json(validatorErrors);
  }

  // Checking the foreign key values if there is any
  const errors = await getForeignKeyValueErrors(context);
  if (errors.length > 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors });
  }

  // We should bind the timestamp values
  bindTimestampValues(context.formData, model, [TimestampColumns.UPDATED_AT]);
};
