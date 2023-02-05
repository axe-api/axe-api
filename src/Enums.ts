export enum ConditionTypes {
  NotNull = "NotNull",
  Null = "Null",
  "=" = "=",
  "<>" = "<>",
  ">" = ">",
  ">=" = ">=",
  "<" = "<",
  "<=" = "<=",
  "LIKE" = "LIKE",
  "NOT LIKE" = "NOT LIKE",
  "In" = "In",
  "NotIn" = "NotIn",
  "Between" = "Between",
  "NotBetween" = "NotBetween",
}

export enum DependencyTypes {
  BIND = "BIND",
  SINGLETON = "SINGLETON",
}

export enum HandlerTypes {
  INSERT = "store",
  PAGINATE = "paginate",
  SHOW = "show",
  UPDATE = "update",
  DELETE = "destroy",
  FORCE_DELETE = "force_delete",
  PATCH = "patch",
  ALL = "all",
}

export enum HookFunctionTypes {
  onBeforeInsert = "onBeforeInsert",
  onBeforeUpdateQuery = "onBeforeUpdateQuery",
  onBeforeUpdate = "onBeforeUpdate",
  onBeforeDeleteQuery = "onBeforeDeleteQuery",
  onBeforeDelete = "onBeforeDelete",
  onBeforeForceDeleteQuery = "onBeforeForceDeleteQuery",
  onBeforeForceDelete = "onBeforeForceDelete",
  onBeforePaginate = "onBeforePaginate",
  onBeforeAll = "onBeforeAll",
  onBeforeShow = "onBeforeShow",
  onAfterInsert = "onAfterInsert",
  onAfterUpdateQuery = "onAfterUpdateQuery",
  onAfterUpdate = "onAfterUpdate",
  onAfterDeleteQuery = "onAfterDeleteQuery",
  onAfterDelete = "onAfterDelete",
  onAfterForceDeleteQuery = "onAfterForceDeleteQuery",
  onAfterForceDelete = "onAfterForceDelete",
  onAfterPaginate = "onAfterPaginate",
  onAfterAll = "onAfterAll",
  onAfterShow = "onAfterShow",
}

export enum Extensions {
  Hooks = "Hooks",
  Events = "Events",
}

export enum HttpMethods {
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  GET = "GET",
  DELETE = "DELETE",
}

export enum LogLevels {
  NONE,
  ERROR,
  WARNING,
  INFO,
  ALL,
}

export enum Relationships {
  HAS_ONE = "HAS_ONE",
  HAS_MANY = "HAS_MANY",
}

export enum SortTypes {
  ASC = "ASC",
  DESC = "DESC",
}

export enum TimestampColumns {
  CREATED_AT = "createdAtColumn",
  UPDATED_AT = "updatedAtColumn",
}

export enum AxeErrorCode {
  UNACCEPTABLE_VERSION_NAME = "UNACCEPTABLE_VERSION_NAME",
  VERSION_CONFIG_NOT_FOUND = "VERSION_CONFIG_NOT_FOUND",
  TABLE_DOESNT_HAVE_ANY_COLUMN = "TABLE_DOESNT_HAVE_ANY_COLUMN",
  RESERVED_VERSION_NAME = "RESERVED_VERSION_NAME",
  UNDEFINED_COLUMN = "UNDEFINED_COLUMN",
  UNDEFINED_RELATION_MODEL = "UNDEFINED_RELATION_MODEL",
  UNDEFINED_HOOK_MODEL_RELATION = "UNDEFINED_HOOK_MODEL_RELATION",
  UNACCEPTABLE_HOOK_FILE = "UNACCEPTABLE_HOOK_FILE",
}
