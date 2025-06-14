import ElasticService from "../../Services/ElasticService";
import { StatusCodes } from "../../Enums";
import { IContext } from "../../Interfaces";
import { IoCService } from "../../Services";
import { getSearchData } from "../../Handlers/Helpers";

export default async (context: IContext) => {
  const { model, res } = context;
  const [returningResult] = await context
    .database(model.instance.table)
    .insert(context.formData)
    .returning(model.instance.primaryKey);

  let insertedPrimaryKeyValue =
    typeof returningResult === "number"
      ? returningResult
      : returningResult[model.instance.primaryKey];

  // If the user use a special primary key value, we should use that value
  if (insertedPrimaryKeyValue === 0) {
    insertedPrimaryKeyValue = context.formData[model.instance.primaryKey];
  }

  context.item = await context
    .database(model.instance.table)
    .where(model.instance.primaryKey, insertedPrimaryKeyValue)
    .first();

  // Add index values
  if (model.instance.search) {
    const elastic = await IoCService.use<ElasticService>("Elastic");
    const body: any = getSearchData(model, context.item);
    await elastic.insert(
      model.name,
      context.item[model.instance.primaryKey],
      body,
    );
  }

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  res.status(StatusCodes.CREATED);
};
