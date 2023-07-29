import { IRequestPack } from "../Interfaces";

export default async (context: IRequestPack) => {
  return context.result;
};
