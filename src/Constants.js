export const LOG_LEVEL = {
  NONE: 0,
  ERROR: 1,
  WARNING: 2,
  INFO: 3,
  ALL: 4,
};

export const HOOK_FUNCTIONS = {
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

export const RELATIONSHIPS = {
  HAS_ONE: "HAS_ONE",
  HAS_MANY: "HAS_MANY",
};

export const DEFAULT_METHODS_OF_MODELS = [
  "constructor",
  "hasMany",
  "hasOne",
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
