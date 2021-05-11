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

const API_FEATURES = {
  INSERT: "store",
  ALL: "all",
  PAGINATE: "paginate",
  SHOW: "show",
  UPDATE: "update",
  DELETE: "destroy",
  COUNT: "count",
  BULK_INSERT: "bulkInsert",
  BULK_DELETE: "bulkDelete",
  BULK_UPDATE: "bulkUpdate",
  SOFT_DELETE: "softDelete",
};

/**
 * Possible names;
 *
 * Hooks & Events => "Actions" ismini "Hooks" ile değiştirebiliriz.
 * Dokümanda ikisini bir arada veririz. Zaten birlikte çağrılıyorlar. Tek farkları
 * birinin (Events) eşzamanlı olarak çalıştırılması.
 *
 * Actions (HTTP Methodları) => apis() ya da features() altında gerçekleştirilebilir.
 * Ancak yukarıdaki API_FEATURES sabiti kullanılmak zorunda. Pek çok farklı özellik
 * ekleyebiliriz. Bunu sadece "HTTP Methods" olarak düşünmek yanlış olur. Kullanıcılar
 * hem "paginate" hem de "show" için ayrı ayrı middleware belirleyebilir.
 *
 * Ek olarak; middleware kavramı "hooks" içerisinde değerlendirebilir. Genel "hooks"
 * tanımı yapılabilirse, bu zaten middleware yerine geçer. "beforeEach", "afterEach"
 * gibi iki "hooks" ile birlikte hem middleware, hem de serializer sorunları çözülmüş
 * olabilir. Hatta belki "beforeAll", "afterAll" gibi iki tane genel middleware/hooks
 * tanımı da yaptırabiliriz developera.
 *
 * Hatta, kendi CLI'ımızla birlikte işi biraz abartıp, her model oluştuğunda ilgili
 * model için bir dosya oluşturup (Hooks/User/index.js) örnek hooks tanımlarını ilave
 * edebiliriz;
 *
 * export default {
 *  onBeforeAll: null,
 *  onAfterAll: null,
 *  paginate: {
 *    onBefore: null,
 *    onBeforeCreate: null,
 *    onAfterCreate: null,
 *    onAfter: null,
 *  },
 * }
 *
 * before/after
 * create/update/delete/query
 *
 *            basic | create | update | delete | query
 * paginate    B/A                                B/A
 * show        B/A                                B/A
 * update      B/A               B/A              B/A
 */

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
  API_FEATURES,
};
