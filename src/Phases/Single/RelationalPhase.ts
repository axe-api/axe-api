import { getRelatedData } from "../../Handlers/Helpers";
import { IContext } from "../../Interfaces";

export default async (context: IContext) => {
  // We should try to get related data if there is any
  await getRelatedData(
    context.version,
    [context.item],
    context.conditions?.with || [],
    context.model,
    context.version.modelList,
    context.database,
    context.handlerType,
    context.req
  );
};
