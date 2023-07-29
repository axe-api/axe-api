import { IRequestPack } from "../../Interfaces";

export default async (context: IRequestPack) => {
  if (context.query) {
    context.result = await context.query;
  }
};
