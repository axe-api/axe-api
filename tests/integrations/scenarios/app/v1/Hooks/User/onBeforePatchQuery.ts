import { IBeforePatchQueryContext } from "axe-api";

export default async ({ res }: IBeforePatchQueryContext) => {
  res.header("x-custom-hook", "onBeforePatchQuery");
};
