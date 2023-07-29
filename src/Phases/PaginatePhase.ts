import { IRequestPack } from "../Interfaces";

export default async (context: IRequestPack) => {
  context.result = await (context.query as any).paginate({
    perPage: context.conditions?.per_page || 10,
    currentPage: context.conditions?.page || 1,
    isLengthAware: true,
  });
};
