import { IBeforePaginateContext } from "axe-api";

export default async ({ model }: IBeforePaginateContext) => {
  console.log("HERE", model);
};
