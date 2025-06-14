import { IContext } from "../../Interfaces";
import { StatusCodes } from "../../Enums";
import {
  addForeignKeyQuery,
  checkPrimaryKeyValueType,
} from "../../Handlers/Helpers";

export default async (context: IContext) => {
  if (context.queryParser && context.query && context.conditions) {
    // Users should be able to filter records
    context.queryParser.applyWheres(context.query, context.conditions?.q || []);

    // Users should be able to select some fields to show.
    context.queryParser.applyFields(context.query, context.conditions.fields);

    // If there is a relation, we should bind it
    addForeignKeyQuery(
      context.req,
      context.query,
      context.relation,
      context.parentModel,
    );

    // We should check the parameter type
    const value = context.params[context.model.instance.primaryKey];
    checkPrimaryKeyValueType(context.model, value);

    // Adding the main query
    context.query.where(context.model.instance.primaryKey, value);

    context.item = await context.query.first();
    if (!context.item) {
      context.res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `The item is not found on ${context.model.name}.` });
    }
  }
};
