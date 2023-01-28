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
