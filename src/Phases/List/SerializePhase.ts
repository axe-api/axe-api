import { filterHiddenFields, serializeData } from "../../Handlers/Helpers";
import { IContext } from "../../Interfaces";

export default async (context: IContext) => {
  // Serializing the data by the model's serialize method
  context.result.data = await serializeData(
    context.version,
    context.result?.data || context.result || [],
    context.model.serialize,
    context.handlerType,
    context.req,
  );

  // Filtering hidden fields from the response data.
  filterHiddenFields(context.result.data, context.model.instance.hiddens);
};
