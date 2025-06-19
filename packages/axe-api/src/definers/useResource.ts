export const useResource = <
  TSchema extends {
    table: string;
    primaryKey: string;
    model: any;
    columns: readonly string[];
  },
>(
  schema: TSchema,
) => {
  type T = ExtractModel<TSchema>;

  const config: ResourceConfig<T> = {
    tableName: schema.table,
    primaryKey: schema.primaryKey,
    columns: schema.columns as string[],
    fillables: [],
  };

  return {
    config,
    primaryKey(column: keyof T) {
      config.primaryKey = column as string;
    },
  } as Resource<T>;
};

export type ExtractModel<T> = T extends { model: infer M } ? M : never;

export type ResourceConfig<T> = {
  tableName: string;
  columns: string[];
  primaryKey: keyof T;
  fillables: Array<keyof T>;
};

export type Resource<T> = {
  config: ResourceConfig<T>;
  primaryKey: (column: keyof T) => void;
};
