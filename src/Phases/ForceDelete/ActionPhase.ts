import { IContext } from "../../Interfaces";

export default async (context: IContext) => {
  if (context.query) {
    await context.query.delete();
  }
};
