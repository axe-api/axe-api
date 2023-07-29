import { getRelatedData } from "../Handlers/Helpers";
import { IRequestPack } from "../Interfaces";

export default async (context: IRequestPack) => {
  // We should try to get related data if there is any
  await getRelatedData(
    context.version,
    context.result.data,
    context.conditions?.with || [],
    context.model,
    context.version.modelList,
    context.database,
    context.handlerType,
    context.req
  );
};
