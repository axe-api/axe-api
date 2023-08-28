import { IContext } from "../../Interfaces";

export default async (context: IContext) => {
  if (context.query) {
    context.result = await context.query;
  }
};
