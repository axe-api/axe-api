import { IRequestPack } from "../../Interfaces";

export default async (context: IRequestPack) => {
  context.res.noContent();
};
