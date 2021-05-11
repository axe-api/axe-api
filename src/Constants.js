const LOG_LEVEL = {
  NONE: 0,
  ERROR: 1,
  WARNING: 2,
  INFO: 3,
  ALL: 4,
};

const HOOK_FUNCTIONS = {
  onBeforeCreate: "onBeforeCreate",
  onBeforeUpdateQuery: "onBeforeUpdateQuery",
  onBeforeUpdate: "onBeforeUpdate",
  onBeforeDelete: "onBeforeDelete",
  onBeforePaginate: "onBeforePaginate",
  onBeforeShow: "onBeforeShow",
  onAfterCreate: "onAfterCreate",
  onAfterUpdateQuery: "onAfterUpdateQuery",
  onAfterUpdate: "onAfterUpdate",
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

const API_ENDPOINT_SCHEMA = {
  GET: [
    {
      url: (parentUrl, resource) => `/api/${parentUrl}${resource}`,
      method: "paginate",
    },
    {
      url: (parentUrl, resource) => `/api/${parentUrl}${resource}/:id`,
      method: "show",
    },
  ],
  POST: [
    {
      url: (parentUrl, resource) => `/api/${parentUrl}${resource}`,
      method: "store",
    },
  ],
  PUT: [
    {
      url: (parentUrl, resource) => `/api/${parentUrl}${resource}/:id`,
      method: "update",
    },
  ],
  DELETE: [
    {
      url: (parentUrl, resource) => `/api/${parentUrl}${resource}/:id`,
      method: "destroy",
    },
  ],
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
  API_ENDPOINT_SCHEMA,
  LOG_COLORS,
  DEPENDECY_TYPES,
};
