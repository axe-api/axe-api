import { filterHiddenFields, serializeData } from "src/Handlers/Helpers";
import { IRequestPack } from "../Interfaces";

export default async (context: IRequestPack) => {
  // Serializing the data by the model's serialize method
  context.result.data = await serializeData(
    context.version,
    context.result.data,
    context.model.serialize,
    context.handlerType,
    context.req
  );

  // Filtering hidden fields from the response data.
  filterHiddenFields(context.result.data, context.model.instance.hiddens);
};
