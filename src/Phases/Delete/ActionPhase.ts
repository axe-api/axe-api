import { IoCService } from "../../Services";
import { IContext } from "../../Interfaces";
import ElasticService from "../../Services/ElasticService";
import { getSearchData } from "../../Handlers/Helpers";

export default async (context: IContext) => {
  const { model, req } = context;

  if (context.query) {
    // If there is a deletedAtColumn, it means that this table support soft-delete
    if (model.instance.deletedAtColumn) {
      await context.query.update({
        [model.instance.deletedAtColumn]: new Date(),
      });

      // Fetching the latest version of the item
      const item = await context
        .database(model.instance.table)
        .where(model.instance.primaryKey, req.params[model.instance.primaryKey])
        .first();

      // Updat the index values
      if (model.instance.search) {
        const elastic = await IoCService.use<ElasticService>("Elastic");
        const body: any = getSearchData(model, item);
        await elastic.update(
          model.name,
          context.item[model.instance.primaryKey],
          body,
        );
      }
    } else {
      await context.query.delete();

      // Updat the index values
      if (model.instance.search) {
        const elastic = await IoCService.use<ElasticService>("Elastic");
        await elastic.delete(
          model.name,
          context.item[model.instance.primaryKey],
        );
      }
    }
  }
};
