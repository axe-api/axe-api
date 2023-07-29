import { IRequestPack } from "../../Interfaces";
import { StatusCodes } from "../../Enums";

export default async (context: IRequestPack) => {
  if (context.query) {
    context.item = await context.query.first();
    if (!context.item) {
      context.res.json(
        { error: `The item is not found on ${context.model.name}.` },
        StatusCodes.NOT_FOUND
      );
    }
  }
};
