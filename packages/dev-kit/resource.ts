export type Users = {
  id: number;
  name: string;
  email: string;
};

export type Posts = {
  id: number;
  title: string;
};

export const Schema = {
  Users: {
    table: "users",
    model: {} as Users,
    columns: ["id", "name", "email"] as const,
  },
  Posts: {
    table: "posts",
    model: {} as Posts,
    columns: ["id", "title"] as const,
  },
};

export type ExtractModel<T> = T extends { model: infer M } ? M : never;

export type LowerModelName = Lowercase<keyof typeof Schema>;

export type RelationTree = {
  [K in LowerModelName]?: RelationTree; // recursive type
};

export const createResources = <T extends readonly ResourceMutation<any>[]>(
  ...args: T
) => args;

type HandlerTypes = "insert" | "update";

type HookFunction = () => Promise<void> | void;

export interface ResourceHooks {
  onBefore: HookFunction[];
  onAfter: HookFunction[];
}

export interface ResourceHandler<T> {
  fillables?: Array<keyof T>;
  rules?: Partial<Record<keyof T, string[]>>;
  hooks: ResourceHooks;
}

export interface ResourceConfig<T> {
  tabneName: string;
  columns: string[];
  primaryKey: string;
  handlers: Record<HandlerTypes, ResourceHandler<T>>;
  middlewares: MiddlewareFunction[];
}

export interface ResourceMutation<T> {
  config: ResourceConfig<T>;
  primaryKey: (column: keyof T) => void;
  insert: HandlerMutation<T>;
  update: HandlerMutation<T>;
  middlewares: (...middlewares: MiddlewareFunction[]) => void;
}

export interface HandlerMutation<T> {
  validation: (rules: Partial<Record<keyof T, string[]>>) => void;
  fillable: (columns: Array<keyof T>) => void;
  hooks: HookMutation<T>;
}

export interface HookMutation<T> {
  onBefore: (hooks: HookFunction[]) => void;
  onAfter: (hooks: HookFunction[]) => void;
}

const defineHook = <T>(handler: ResourceHandler<T>) => {
  return {
    onBefore: (hooks: HookFunction[]) => {
      handler.hooks.onBefore.push(...hooks);
    },
    onAfter: (hooks: HookFunction[]) => {
      handler.hooks.onAfter.push(...hooks);
    },
  };
};

const defineHandler = <T>(handler: ResourceHandler<T>) => {
  return {
    validation: (rules: Partial<Record<keyof T, string[]>>) => {
      handler.rules = rules;
    },
    fillable: (columns: Array<keyof T>) => {
      handler.fillables = columns;
    },
    hooks: defineHook(handler),
  };
};

type MiddlewareFunction = () => void;

export const defineResource = <
  TSchema extends { table: string; model: any; columns: readonly string[] },
>(
  schema: TSchema
) => {
  type T = ExtractModel<TSchema>;

  const config: ResourceConfig<T> = {
    tabneName: schema.table,
    primaryKey: "id",
    columns: schema.columns as string[],
    middlewares: [],
    handlers: {
      insert: {
        hooks: {
          onBefore: [],
          onAfter: [],
        },
      },
      update: {
        hooks: {
          onBefore: [],
          onAfter: [],
        },
      },
    },
  };

  const resource: ResourceMutation<T> = {
    config,
    primaryKey(column: keyof T) {
      config.primaryKey = column as string;
    },
    insert: defineHandler(config.handlers.insert),
    update: defineHandler(config.handlers.update),
    middlewares(...middlewares: MiddlewareFunction[]) {
      config.middlewares.push(...middlewares);
    },
  };

  return resource;
};

export const useHandler = <T>(
  handler: HandlerTypes,
  resource: ResourceMutation<T>
) => {
  return {
    fillable: (columns: Array<keyof T>) => {
      resource.config.handlers[handler].fillables = columns;
    },
    validation: (rules: Partial<Record<keyof T, string[]>>) => {
      resource.config.handlers[handler].rules = rules;
    },
  };
};

export const useInsertHandler = <T>(resource: ResourceMutation<T>) =>
  useHandler("insert", resource);
