import { IContext } from "../../Interfaces";
import { cleanRelatedCachedObjectByModel } from "../../Handlers/Helpers";
import { CacheStrategies } from "../../Enums";

export default async (context: IContext) => {
  const { item, res, model, handlerType } = context;

  // Deleting all cached result for the model
  const config = model.getCacheConfiguration(handlerType);
  if (config?.invalidation === CacheStrategies.TagBased) {
    cleanRelatedCachedObjectByModel(model, config);
  }

  // Preparing the json response
  res.json(item);
};
