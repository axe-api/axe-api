export type NewHandlerTypes =
  | "store"
  | "paginate"
  | "show"
  | "update"
  | "destroy"
  | "force_delete"
  | "patch"
  | "all"
  | "search";

export type SchemaDefinition = {
  table: string;
  primaryKey: string;
  model: unknown;
  columns: readonly string[];
};

export type ExtractResouceDefinition<T> = T extends { model: infer M }
  ? M
  : never;

export type ExtractResource<T> = T;

export type BaseHandlerConfig = {
  type: NewHandlerTypes;
};

export type PaginateHandlerConfig<ResourceType> = BaseHandlerConfig & {
  minPerPage: number;
  defaultPerPage: number;
  maxPerPage: number;
  allowedFields: Array<keyof ResourceType>;
};

export type HandlerConfig<ResourceType> = PaginateHandlerConfig<ResourceType>;

export type DefaultHandler<ResourceType> = {
  config: HandlerConfig<ResourceType>;
  getConfig: () => HandlerConfig<ResourceType>;
};
