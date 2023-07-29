import { IRequestPack } from "../../Interfaces";

export default async (context: IRequestPack) => {
  if (context.query) {
    await context.query.delete();
  }
};
