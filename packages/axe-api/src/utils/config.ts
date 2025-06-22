export const removeFunctions = (key: string, value: unknown): unknown => {
  if (typeof value === "function") {
    return undefined;
  }
  return value;
};
