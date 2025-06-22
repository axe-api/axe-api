export type DefaultTable = {
  id: number;
};

export const DEFAULT_SCHEMA = {
  table: "",
  primaryKey: "",
  model: {} as DefaultTable,
  columns: ["id"] as const,
};
