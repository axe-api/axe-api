import { IoCService } from "../../Services";
import { IContext } from "../../Interfaces";
import ElasticService from "../../Services/ElasticService";

export default async (context: IContext) => {
  const { model } = context;

  if (context.query) {
    await context.query.delete();

    // Updat the index values
    if (model.instance.search) {
      const elastic = await IoCService.use<ElasticService>("Elastic");
      await elastic.delete(model.name, context.item[model.instance.primaryKey]);
    }
  }
};
