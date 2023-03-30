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

export enum Frameworks {
  Express = "express",
  Fastify = "fastify",
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
  UNDEFINED_RELATION_NAME = "UNDEFINED_RELATION_NAME",
}

export enum QueryFeatureType {
  Allow = "Allow",
  Deny = "Deny",
}

export enum QueryFeature {
  All = "all",
  FieldsAll = "fieldsAll",
  Sorting = "sorting",
  Limits = "limits",
  WhereAll = "where.*",
  WhereEqual = "where.equal",
  WhereNotEqual = "where.notEqual",
  WhereGt = "where.gt",
  WhereGte = "where.gte",
  WhereLt = "where.lt",
  WhereLte = "where.lte",
  WhereLike = "where.like",
  WhereNotLike = "where.notLike",
  WhereIn = "where.in",
  WhereNotIn = "where.notIn",
  WhereBetween = "where.between",
  WhereNotBetween = "where.notBetween",
  WhereNull = "where.null",
  WhereNotNull = "where.notNull",
  Trashed = "trashed",
  WithAll = "with.*",
  WithHasOne = "with.hasOne",
  WithHasMany = "with.hasMany",
}

export enum StatusCodes {
  ACCEPTED = 202,
  BAD_GATEWAY = 502,
  BAD_REQUEST = 400,
  CONFLICT = 409,
  CONTINUE = 100,
  CREATED = 201,
  EXPECTATION_FAILED = 417,
  FAILED_DEPENDENCY = 424,
  FORBIDDEN = 403,
  GATEWAY_TIMEOUT = 504,
  GONE = 410,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  IM_A_TEAPOT = 418,
  INSUFFICIENT_SPACE_ON_RESOURCE = 419,
  INSUFFICIENT_STORAGE = 507,
  INTERNAL_SERVER_ERROR = 500,
  LENGTH_REQUIRED = 411,
  LOCKED = 423,
  METHOD_FAILURE = 420,
  METHOD_NOT_ALLOWED = 405,
  MOVED_PERMANENTLY = 301,
  MOVED_TEMPORARILY = 302,
  MULTI_STATUS = 207,
  MULTIPLE_CHOICES = 300,
  NETWORK_AUTHENTICATION_REQUIRED = 511,
  NO_CONTENT = 204,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NOT_ACCEPTABLE = 406,
  NOT_FOUND = 404,
  NOT_IMPLEMENTED = 501,
  NOT_MODIFIED = 304,
  OK = 200,
  PARTIAL_CONTENT = 206,
  PAYMENT_REQUIRED = 402,
  PERMANENT_REDIRECT = 308,
  PRECONDITION_FAILED = 412,
  PRECONDITION_REQUIRED = 428,
  PROCESSING = 102,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  REQUEST_TIMEOUT = 408,
  REQUEST_TOO_LONG = 413,
  REQUEST_URI_TOO_LONG = 414,
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  RESET_CONTENT = 205,
  SEE_OTHER = 303,
  SERVICE_UNAVAILABLE = 503,
  SWITCHING_PROTOCOLS = 101,
  TEMPORARY_REDIRECT = 307,
  TOO_MANY_REQUESTS = 429,
  UNAUTHORIZED = 401,
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,
  UNPROCESSABLE_ENTITY = 422,
  UNSUPPORTED_MEDIA_TYPE = 415,
  USE_PROXY = 305,
  MISDIRECTED_REQUEST = 421,
}
