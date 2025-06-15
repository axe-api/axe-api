import { IContext } from "../../Interfaces";

export default async (context: IContext) => {
  const { res } = context;

  res.noContent();
};
