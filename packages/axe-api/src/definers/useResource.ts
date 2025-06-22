import { removeFunctions } from "../utils/config";
import {
  DefaultHandler,
  ExtractResouceDefinition,
  HandlerConfig,
  SchemaDefinition,
} from "./xTypes";

export type Resource<ResourceType> = {
  config: ResourceConfig<ResourceType>;

  /**
   * Set the primary key for the resource. The default value used via the schema.
   */
  primaryKey(id: keyof ResourceType): void;
  handlers(...handlers: Array<DefaultHandler<ResourceType>>): void;
  getConfig(): unknown;
};

export type ResourceConfig<ResourceType> = {
  tableName: string;
  columns: string[];
  primaryKey: keyof ResourceType;
  handlers: Array<HandlerConfig<ResourceType>>;
};

export const useResource = <TSchema extends SchemaDefinition>(
  schema: TSchema,
) => {
  type ResourceType = ExtractResouceDefinition<TSchema>;

  const config: ResourceConfig<ResourceType> = {
    tableName: schema.table,
    primaryKey: schema.primaryKey as keyof ResourceType,
    columns: schema.columns as string[],
    handlers: [],
  };

  return {
    config,

    primaryKey(column: keyof ResourceType) {
      config.primaryKey = column;
    },

    handlers(...handlers: Array<DefaultHandler<ResourceType>>) {
      config.handlers.push(...handlers.map((handler) => handler.config));
    },

    getConfig() {
      return JSON.parse(JSON.stringify(config, removeFunctions, 2));
    },
  } as Resource<ResourceType>;
};
