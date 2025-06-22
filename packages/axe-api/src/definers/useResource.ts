import { removeFunctions } from "../utils/config";
import { BaseHandler } from "./useHandler";

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
    handers: [],
  };

  return {
    config,
    primaryKey(column: keyof T) {
      config.primaryKey = column as string;
    },
    bind(...handers: Array<BaseHandler<T>>) {
      config.handers.push(...handers);
    },
    getConfig() {
      return JSON.parse(JSON.stringify(config, removeFunctions, 2));
    },
  } as Resource<T>;
};

export type ExtractModel<T> = T extends { model: infer M } ? M : never;

export type ResourceConfig<T> = {
  tableName: string;
  columns: string[];
  primaryKey: keyof T;
  handers: Array<BaseHandler<T>>;
};

export type Resource<T> = {
  config: ResourceConfig<T>;
  primaryKey: (column: keyof T) => void;
  bind: (...handers: Array<BaseHandler<T>>) => void;
  getConfig: () => unknown;
};
