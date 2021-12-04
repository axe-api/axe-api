const LOG_LEVEL = {
  NONE: 0,
  ERROR: 1,
  WARNING: 2,
  INFO: 3,
  ALL: 4,
};

const HOOK_FUNCTIONS = {
  onBeforeInsert: "onBeforeInsert",
  onBeforeUpdateQuery: "onBeforeUpdateQuery",
  onBeforeUpdate: "onBeforeUpdate",
  onBeforeDeleteQuery: "onBeforeDeleteQuery",
  onBeforeDelete: "onBeforeDelete",
  onBeforePaginate: "onBeforePaginate",
  onBeforeAll: "onBeforeAll",
  onBeforeShow: "onBeforeShow",
  onAfterInsert: "onAfterInsert",
  onAfterUpdateQuery: "onAfterUpdateQuery",
  onAfterUpdate: "onAfterUpdate",
  onAfterDeleteQuery: "onAfterDeleteQuery",
  onAfterDelete: "onAfterDelete",
  onAfterPaginate: "onAfterPaginate",
  onAfterAll: "onAfterAll",
  onAfterShow: "onAfterShow",
};

const RELATIONSHIPS = {
  HAS_ONE: "HAS_ONE",
  HAS_MANY: "HAS_MANY",
};

const DEFAULT_METHODS_OF_MODELS = [
  "constructor",
  "hasMany",
  "hasOne",
  "belongsTo",
  "serialize",
  "__defineGetter__",
  "__defineSetter__",
  "hasOwnProperty",
  "__lookupGetter__",
  "__lookupSetter__",
  "isPrototypeOf",
  "propertyIsEnumerable",
  "toString",
  "valueOf",
  "toLocaleString",
];

const HANDLERS = {
  INSERT: "store",
  PAGINATE: "paginate",
  SHOW: "show",
  UPDATE: "update",
  DELETE: "destroy",
  PATCH: "patch",
  ALL: "all",
};

const DEFAULT_HANDLERS = [
  HANDLERS.INSERT,
  HANDLERS.PAGINATE,
  HANDLERS.SHOW,
  HANDLERS.UPDATE,
  HANDLERS.PATCH,
  HANDLERS.DELETE,
];

const HTTP_METHODS = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
};

const API_ROUTE_TEMPLATES = {
  [HANDLERS.INSERT]: {
    url: (prefix, parentUrl, resource) => `/${prefix}/${parentUrl}${resource}`,
    method: HTTP_METHODS.POST,
  },
  [HANDLERS.PAGINATE]: {
    url: (prefix, parentUrl, resource) => `/${prefix}/${parentUrl}${resource}`,
    method: HTTP_METHODS.GET,
  },
  [HANDLERS.ALL]: {
    url: (prefix, parentUrl, resource) =>
      `/${prefix}/${parentUrl}${resource}/all`,
    method: HTTP_METHODS.GET,
  },
  [HANDLERS.SHOW]: {
    url: (prefix, parentUrl, resource, primaryKey) =>
      `/${prefix}/${parentUrl}${resource}/:${primaryKey}`,
    method: HTTP_METHODS.GET,
  },
  [HANDLERS.UPDATE]: {
    url: (prefix, parentUrl, resource, primaryKey) =>
      `/${prefix}/${parentUrl}${resource}/:${primaryKey}`,
    method: HTTP_METHODS.PUT,
  },
  [HANDLERS.PATCH]: {
    url: (prefix, parentUrl, resource, primaryKey) =>
      `/${prefix}/${parentUrl}${resource}/:${primaryKey}`,
    method: HTTP_METHODS.PATCH,
  },
  [HANDLERS.DELETE]: {
    url: (prefix, parentUrl, resource, primaryKey) =>
      `/${prefix}/${parentUrl}${resource}/:${primaryKey}`,
    method: HTTP_METHODS.DELETE,
  },
};

const LOG_COLORS = {
  fgBlack: "\x1b[30m",
  fgRed: "\x1b[31m",
  fgGreen: "\x1b[32m",
  fgYellow: "\x1b[33m",
  fgBlue: "\x1b[34m",
  fgMagenta: "\x1b[35m",
  fgCyan: "\x1b[36m",
  fgWhite: "\x1b[37m",
  fgReset: "\x1b[0m",
};

const DEPENDECY_TYPES = {
  BIND: "BIND",
  SINGLETON: "SINGLETON",
};

const TIMESTAMP_COLUMNS = {
  CREATED_AT: "createdAtColumn",
  UPDATED_AT: "updatedAtColumn",
};

export {
  LOG_LEVEL,
  HOOK_FUNCTIONS,
  RELATIONSHIPS,
  DEFAULT_METHODS_OF_MODELS,
  HTTP_METHODS,
  API_ROUTE_TEMPLATES,
  LOG_COLORS,
  DEPENDECY_TYPES,
  HANDLERS,
  DEFAULT_HANDLERS,
  TIMESTAMP_COLUMNS,
};
