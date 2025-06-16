import { IBeforeAllContext } from "axe-api";

export default async ({ res }: IBeforeAllContext) => {
  res.status(403).json({ error: "Testing onBeforeAll() hooks" });
};
