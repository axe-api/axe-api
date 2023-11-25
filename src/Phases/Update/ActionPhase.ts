import { IoCService } from "../../Services";
import { IContext } from "../../Interfaces";
import ElasticService from "../../Services/ElasticService";
import { getSearchData } from "../../Handlers/Helpers";

export default async (context: IContext) => {
  const { model } = context;
  if (context.query) {
    // Updating the data
    await context.query
      .where(model.instance.primaryKey, context.item[model.instance.primaryKey])
      .update(context.formData);

    // Fetchinf the latest version of the item
    context.item = await context
      .database(model.instance.table)
      .where(model.instance.primaryKey, context.item[model.instance.primaryKey])
      .first();

    // Updat the index values
    if (model.instance.search) {
      const elastic = await IoCService.use<ElasticService>("Elastic");
      const body: any = getSearchData(model, context.item);
      await elastic.update(
        model.name,
        context.item[model.instance.primaryKey],
        body,
      );
    }
  }
};
