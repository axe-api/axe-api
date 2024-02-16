import { IContext } from "../../Interfaces";
import {
  bindTimestampValues,
  getForeignKeyValueErrors,
  getMergedFormData,
  getParentColumn,
} from "../../Handlers/Helpers";
import { HttpMethods, StatusCodes, TimestampColumns } from "../../Enums";

export default async (context: IContext) => {
  const { req, res, model, validator } = context;
  const requestMethod: HttpMethods = req.method as unknown as HttpMethods;
  const fillables = model.instance.getFillableFields(requestMethod);
  context.formData = getMergedFormData(req, fillables);

  // Form validation
  const validatorErrors = await validator.validate(
    req,
    model,
    context.formData,
  );
  if (validatorErrors) {
    return res.status(StatusCodes.BAD_REQUEST).json(validatorErrors);
  }

  if (context.relation && context.parentModel) {
    const parentColumn = getParentColumn(context.parentModel, context.relation);
    if (parentColumn) {
      context.formData[context.relation.foreignKey] =
        context.params[parentColumn];
    }
  }

  // Checking the foreign key values if there is any
  const errors = await getForeignKeyValueErrors(context);
  if (errors.length > 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors });
  }

  // We should bind the timestamp values
  bindTimestampValues(context.formData, model, [
    TimestampColumns.CREATED_AT,
    TimestampColumns.UPDATED_AT,
  ]);
};
