export type SchemaDefinition = {
  table: string;
  primaryKey: string;
  model: unknown;
  columns: readonly string[];
};

export type ExtractResouceModel<T> = T extends { model: infer M } ? M : never;

export type ExtractModel<T> = T;

export type UResource<Model> = {
  primaryKey: (id: keyof Model) => void;
};
