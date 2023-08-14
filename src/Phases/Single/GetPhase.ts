import { IRequestPack } from "../../Interfaces";
import { checkPrimaryKeyValueType } from "../../Handlers/Helpers";
import { StatusCodes } from "../../Enums";

export default async (context: IRequestPack) => {
  // We should check the parameter type
  const value = context.req.params[context.model.instance.primaryKey];
  checkPrimaryKeyValueType(context.model, value);

  if (context.query) {
    // Adding the main query
    context.item = await context.query
      .where(context.model.instance.primaryKey, value)
      .first();

    if (!context.item) {
      context.res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `The item is not found on ${context.model.name}.` });
    }
  }
};
