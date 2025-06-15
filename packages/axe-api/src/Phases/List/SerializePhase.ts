import { filterHiddenFields, serializeData } from "../../Handlers/Helpers";
import { IContext } from "../../Interfaces";

export default async (context: IContext) => {
  const { version, model, handlerType, req } = context;

  if (context.result?.data) {
    // Serializing the data by the model's serialize method
    context.result.data = await serializeData(
      version,
      context.result?.data || [],
      model.serialize,
      handlerType,
      req,
    );

    // Filtering hidden fields from the response data.
    filterHiddenFields(context.result.data, context.model.instance.hiddens);
  } else if (context.result && Array.isArray(context.result)) {
    context.result = await serializeData(
      version,
      context.result || [],
      model.serialize,
      handlerType,
      req,
    );

    // Filtering hidden fields from the response data.
    filterHiddenFields(context.result, context.model.instance.hiddens);
  }
};
