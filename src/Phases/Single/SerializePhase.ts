import { filterHiddenFields, serializeData } from "../../Handlers/Helpers";
import { IRequestPack } from "../../Interfaces";

export default async (context: IRequestPack) => {
  // Serializing the data by the model's serialize method
  context.item = await serializeData(
    context.version,
    context.item,
    context.model.serialize,
    context.handlerType,
    context.req
  );

  // Filtering hidden fields from the response data.
  filterHiddenFields([context.item], context.model.instance.hiddens);
};
