import { IRequestPack } from "../../Interfaces";
import { StatusCodes } from "../../Enums";

export default async (context: IRequestPack) => {
  if (context.queryParser && context.query) {
    // Users should be able to filter records
    context.queryParser.applyWheres(context.query, context.conditions?.q || []);

    context.item = await context.query.first();
    if (!context.item) {
      context.res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `The item is not found on ${context.model.name}.` });
    }
  }
};
