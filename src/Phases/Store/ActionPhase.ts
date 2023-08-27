import { StatusCodes } from "../../Enums";
import { IRequestPack } from "../../Interfaces";

export default async (context: IRequestPack) => {
  const [returningResult] = await context
    .database(context.model.instance.table)
    .insert(context.formData)
    .returning(context.model.instance.primaryKey);

  let insertedPrimaryKeyValue =
    typeof returningResult === "number"
      ? returningResult
      : returningResult[context.model.instance.primaryKey];

  // If the user use a special primary key value, we should use that value
  if (insertedPrimaryKeyValue === 0) {
    insertedPrimaryKeyValue =
      context.formData[context.model.instance.primaryKey];
  }

  context.item = await context
    .database(context.model.instance.table)
    .where(context.model.instance.primaryKey, insertedPrimaryKeyValue)
    .first();

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  context.res.status(StatusCodes.CREATED);
};
