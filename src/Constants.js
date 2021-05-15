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
  onBeforeShow: "onBeforeShow",
  onAfterInsert: "onAfterInsert",
  onAfterUpdateQuery: "onAfterUpdateQuery",
  onAfterUpdate: "onAfterUpdate",
  onAfterDeleteQuery: "onAfterDeleteQuery",
  onAfterDelete: "onAfterDelete",
  onAfterPaginate: "onAfterPaginate",
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
};

const HTTP_METHODS = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT",
  DELETE: "DELETE",
};

const API_ROUTE_TEMPLATES = {
  [HANDLERS.INSERT]: {
    url: (parentUrl, resource) => `/api/${parentUrl}${resource}`,
    method: HTTP_METHODS.POST,
  },
  [HANDLERS.PAGINATE]: {
    url: (parentUrl, resource) => `/api/${parentUrl}${resource}`,
    method: HTTP_METHODS.GET,
  },
  [HANDLERS.SHOW]: {
    url: (parentUrl, resource) => `/api/${parentUrl}${resource}/:id`,
    method: HTTP_METHODS.GET,
  },
  [HANDLERS.UPDATE]: {
    url: (parentUrl, resource) => `/api/${parentUrl}${resource}/:id`,
    method: HTTP_METHODS.PUT,
  },
  [HANDLERS.DELETE]: {
    url: (parentUrl, resource) => `/api/${parentUrl}${resource}/:id`,
    method: HTTP_METHODS.DELETE,
  },
  // [HANDLERS.ALL]: {
  //   url: (parentUrl, resource) => `/api/${parentUrl}${resource}/all`,
  //   method: HTTP_METHODS.GET,
  // },
  // [HANDLERS.COUNT]: {
  //   url: (parentUrl, resource) => `/api/${parentUrl}${resource}/count`,
  //   method: HTTP_METHODS.GET,
  // },
  // [HANDLERS.BULK_INSERT]: {
  //   url: (parentUrl, resource) => `/api/${parentUrl}${resource}/bulk`,
  //   method: HTTP_METHODS.POST,
  // },
  // [HANDLERS.BULK_DELETE]: {
  //   url: (parentUrl, resource) => `/api/${parentUrl}${resource}/bulk`,
  //   method: HTTP_METHODS.DELETE,
  // },
  // [HANDLERS.BULK_UPDATE]: {
  //   url: (parentUrl, resource) => `/api/${parentUrl}${resource}/bulk`,
  //   method: HTTP_METHODS.PUT,
  // },
  // [HANDLERS.SOFT_DELETE]: {
  //   url: (parentUrl, resource) => `/api/${parentUrl}${resource}/:id/soft`,
  //   method: HTTP_METHODS.DELETE,
  // },
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
};
