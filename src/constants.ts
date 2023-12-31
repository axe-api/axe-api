import {
  CacheStrategies,
  ConditionTypes,
  HandlerTypes,
  HookFunctionTypes,
  HttpMethods,
  QueryFeature,
  Relationships,
} from "./Enums";
import {
  AxeConfig,
  AxeVersionConfig,
  ICacheConfiguration,
  IStepDefinition,
} from "./Interfaces";
import { allow, deny } from "./Services/LimitService";
import Single from "./Phases/Single";
import List from "./Phases/List";
import Paginate from "./Phases/Paginate";
import Search from "./Phases/Search";
import All from "./Phases/All";
import Show from "./Phases/Show";
import Store from "./Phases/Store";
import Update from "./Phases/Update";
import Patch from "./Phases/Patch";
import Delete from "./Phases/Delete";
import ForceDelete from "./Phases/ForceDelete";
import Phase from "./Steps/Phase";
import Hook from "./Steps/Hook";
import Event from "./Steps/Event";
import ErrorHandler from "./Handlers/ErrorHandler";
import GetCachePhase from "./Phases/GetCachePhase";
import CacheTagCleanPhase from "./Phases/CacheTagCleanPhase";
import URLSearchParamPhase from "./Phases/URLSearchParamPhase";
import { defaultCacheKeyFunction } from "./Handlers/Helpers";

export const RESERVED_KEYWORDS: string[] = [
  "force",
  "model",
  "api",
  "routes",
  "docs",
  "hook",
  "hooks",
  "event",
  "events",
  "all",
  "swagger",
];

export const DEFAULT_HANDLERS: HandlerTypes[] = [
  HandlerTypes.INSERT,
  HandlerTypes.PAGINATE,
  HandlerTypes.SHOW,
  HandlerTypes.UPDATE,
  HandlerTypes.PATCH,
  HandlerTypes.DELETE,
];

export const DEFAULT_METHODS_OF_MODELS: string[] = [
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
  "primaryKey",
  "table",
  "fillable",
  "validations",
  "handlers",
  "middlewares",
  "hiddens",
  "createdAtColumn",
  "updatedAtColumn",
  "deletedAtColumn",
  "transaction",
  "ignore",
  "limits",
  "getFillableFields",
  "getValidationRules",
  "cache",
  "search",
  "getSearchQuery",
];

export const API_ROUTE_TEMPLATES = {
  [HandlerTypes.INSERT]: (
    prefix: string,
    parentUrl: string,
    resource: string,
  ) => `/${prefix}/${parentUrl}${resource}`,
  [HandlerTypes.PAGINATE]: (
    prefix: string,
    parentUrl: string,
    resource: string,
  ) => `/${prefix}/${parentUrl}${resource}`,
  [HandlerTypes.ALL]: (prefix: string, parentUrl: string, resource: string) =>
    `/${prefix}/${parentUrl}${resource}/all`,
  [HandlerTypes.SEARCH]: (
    prefix: string,
    parentUrl: string,
    resource: string,
  ) => `/${prefix}/${parentUrl}${resource}/search`,
  [HandlerTypes.SHOW]: (
    prefix: string,
    parentUrl: string,
    resource: string,
    primaryKey: string,
  ) => `/${prefix}/${parentUrl}${resource}/:${primaryKey}`,
  [HandlerTypes.UPDATE]: (
    prefix: string,
    parentUrl: string,
    resource: string,
    primaryKey: string,
  ) => `/${prefix}/${parentUrl}${resource}/:${primaryKey}`,
  [HandlerTypes.PATCH]: (
    prefix: string,
    parentUrl: string,
    resource: string,
    primaryKey: string,
  ) => `/${prefix}/${parentUrl}${resource}/:${primaryKey}`,
  [HandlerTypes.DELETE]: (
    prefix: string,
    parentUrl: string,
    resource: string,
    primaryKey: string,
  ) => `/${prefix}/${parentUrl}${resource}/:${primaryKey}`,
  [HandlerTypes.FORCE_DELETE]: (
    prefix: string,
    parentUrl: string,
    resource: string,
    primaryKey: string,
  ) => `/${prefix}/${parentUrl}${resource}/:${primaryKey}/force`,
};

export const ConditionQueryFeatureMap: Record<ConditionTypes, QueryFeature> = {
  [ConditionTypes.NotNull]: QueryFeature.WhereNotNull,
  [ConditionTypes.Null]: QueryFeature.WhereNull,
  [ConditionTypes["="]]: QueryFeature.WhereEqual,
  [ConditionTypes["<>"]]: QueryFeature.WhereNotEqual,
  [ConditionTypes[">"]]: QueryFeature.WhereGt,
  [ConditionTypes[">="]]: QueryFeature.WhereGte,
  [ConditionTypes["<"]]: QueryFeature.WhereLt,
  [ConditionTypes["<="]]: QueryFeature.WhereLte,
  [ConditionTypes["LIKE"]]: QueryFeature.WhereLike,
  [ConditionTypes["NOT LIKE"]]: QueryFeature.WhereNotLike,
  [ConditionTypes["ILIKE"]]: QueryFeature.WhereILike,
  [ConditionTypes["NOT ILIKE"]]: QueryFeature.WhereNotILike,
  [ConditionTypes["In"]]: QueryFeature.WhereIn,
  [ConditionTypes["NotIn"]]: QueryFeature.WhereNotIn,
  [ConditionTypes["Between"]]: QueryFeature.WhereBetween,
  [ConditionTypes["NotBetween"]]: QueryFeature.WhereNotBetween,
};

export const RelationQueryFeatureMap: Record<Relationships, QueryFeature> = {
  [Relationships.HAS_ONE]: QueryFeature.WithHasOne,
  [Relationships.HAS_MANY]: QueryFeature.WithHasMany,
};

export const NUMERIC_PRIMARY_KEY_TYPES = ["integer", "bigint"];

export const STRING_COLUMN_TYPES = [
  "CHAR",
  "VARCHAR",
  "BINARY",
  "VARBINARY",
  "BLOB",
  "TEXT",
  "ENUM",
  "SET",
  "character varying",
  "character",
  "bpchar",
].map((item) => item.toLowerCase());

export const HANDLER_METHOD_MAP: Record<HandlerTypes, HttpMethods> = {
  [HandlerTypes.INSERT]: HttpMethods.POST,
  [HandlerTypes.PAGINATE]: HttpMethods.GET,
  [HandlerTypes.SHOW]: HttpMethods.GET,
  [HandlerTypes.UPDATE]: HttpMethods.PUT,
  [HandlerTypes.DELETE]: HttpMethods.DELETE,
  [HandlerTypes.FORCE_DELETE]: HttpMethods.DELETE,
  [HandlerTypes.PATCH]: HttpMethods.PATCH,
  [HandlerTypes.ALL]: HttpMethods.GET,
  [HandlerTypes.SEARCH]: HttpMethods.GET,
};

export const HANDLER_CYLES: Record<HandlerTypes, IStepDefinition[]> = {
  [HandlerTypes.INSERT]: [
    new Phase("insert.prepare", Store.PreparePhase),
    new Hook(HookFunctionTypes.onBeforeInsert),
    new Event(HookFunctionTypes.onBeforeInsert),
    new Phase("insert.action", Store.ActionPhase),
    new Hook(HookFunctionTypes.onAfterInsert),
    new Event(HookFunctionTypes.onAfterInsert),
    new Phase("insert.serialize", Single.SerializePhase),
    new Phase("insert.response", Store.ResultPhase),
  ],
  [HandlerTypes.PAGINATE]: [
    new Phase("paginate.cache", GetCachePhase),
    new Phase("paginate.URLSearchParamPhase", URLSearchParamPhase),
    new Phase("paginate.prepareQuery", Paginate.PreparePhase),
    new Hook(HookFunctionTypes.onBeforePaginate),
    new Event(HookFunctionTypes.onBeforePaginate),
    new Phase("paginate.query", Paginate.FetchPhase),
    new Phase("paginate.relational", List.RelationalPhase),
    new Hook(HookFunctionTypes.onAfterPaginate),
    new Event(HookFunctionTypes.onAfterPaginate),
    new Phase("paginate.serialize", List.SerializePhase),
    new Phase("paginate.response", List.ResultPhase),
  ],
  [HandlerTypes.SEARCH]: [
    new Phase("search.cache", GetCachePhase),
    new Phase("search.URLSearchParamPhase", URLSearchParamPhase),
    new Phase("search.prepareQuery", Search.PreparePhase),
    new Hook(HookFunctionTypes.onBeforePaginate),
    new Event(HookFunctionTypes.onBeforePaginate),
    new Phase("search.query", Search.FetchPhase),
    new Phase("search.relational", List.RelationalPhase),
    new Hook(HookFunctionTypes.onAfterPaginate),
    new Event(HookFunctionTypes.onAfterPaginate),
    new Phase("search.serialize", List.SerializePhase),
    new Phase("search.response", List.ResultPhase),
  ],
  [HandlerTypes.SHOW]: [
    new Phase("show.cache", GetCachePhase),
    new Phase("show.URLSearchParamPhase", URLSearchParamPhase),
    new Phase("show.prepareQuery", Show.PreparePhase),
    new Hook(HookFunctionTypes.onBeforeShow),
    new Event(HookFunctionTypes.onBeforeShow),
    new Phase("show.query", Show.FetchPhase),
    new Phase("show.relational", Single.RelationalPhase),
    new Hook(HookFunctionTypes.onAfterShow),
    new Event(HookFunctionTypes.onAfterShow),
    new Phase("show.serialize", Single.SerializePhase),
    new Phase("show.response", Single.ResultPhase),
  ],
  [HandlerTypes.UPDATE]: [
    new Phase("update.URLSearchParamPhase", URLSearchParamPhase),
    new Phase("update.prepareQuery", Single.PrepareGetPhase),
    new Hook(HookFunctionTypes.onBeforeUpdateQuery),
    new Event(HookFunctionTypes.onBeforeUpdateQuery),
    new Phase("update.query", Single.GetPhase),
    new Hook(HookFunctionTypes.onAfterUpdateQuery),
    new Event(HookFunctionTypes.onAfterUpdateQuery),
    new Phase("update.prepareAction", Update.PrepareActionPhase),
    new Hook(HookFunctionTypes.onBeforeUpdate),
    new Event(HookFunctionTypes.onBeforeUpdate),
    new Phase("update.action", Update.ActionPhase),
    new Hook(HookFunctionTypes.onAfterUpdate),
    new Event(HookFunctionTypes.onAfterUpdate),
    new Phase("update.cleanCleanTags", CacheTagCleanPhase),
    new Phase("update.serialize", Single.SerializePhase),
    new Phase("update.response", Single.ResultPhase),
  ],
  [HandlerTypes.DELETE]: [
    new Phase("delete.URLSearchParamPhase", URLSearchParamPhase),
    new Phase("delete.prepareQuery", Delete.PreparePhase),
    new Hook(HookFunctionTypes.onBeforeDeleteQuery),
    new Event(HookFunctionTypes.onBeforeDeleteQuery),
    new Phase("delete.query", Delete.QueryPhase),
    new Hook(HookFunctionTypes.onAfterDeleteQuery),
    new Event(HookFunctionTypes.onAfterDeleteQuery),
    new Hook(HookFunctionTypes.onBeforeDelete),
    new Event(HookFunctionTypes.onBeforeDelete),
    new Phase("delete.action", Delete.ActionPhase),
    new Hook(HookFunctionTypes.onAfterDelete),
    new Event(HookFunctionTypes.onAfterDelete),
    new Phase("delete.cleanCleanTags", CacheTagCleanPhase),
    new Phase("delete.response", Delete.ResponsePhase),
  ],
  [HandlerTypes.FORCE_DELETE]: [
    new Phase("force-delete.URLSearchParamPhase", URLSearchParamPhase),
    new Phase("force-delete.prepareQuery", ForceDelete.PreparePhase),
    new Hook(HookFunctionTypes.onBeforeForceDeleteQuery),
    new Event(HookFunctionTypes.onBeforeForceDeleteQuery),
    new Phase("force-delete.query", ForceDelete.QueryPhase),
    new Hook(HookFunctionTypes.onAfterForceDeleteQuery),
    new Event(HookFunctionTypes.onAfterForceDeleteQuery),
    new Hook(HookFunctionTypes.onBeforeForceDelete),
    new Event(HookFunctionTypes.onBeforeForceDelete),
    new Phase("force-delete.action", ForceDelete.ActionPhase),
    new Hook(HookFunctionTypes.onAfterForceDelete),
    new Event(HookFunctionTypes.onAfterForceDelete),
    new Phase("force-delete.cleanCleanTags", CacheTagCleanPhase),
    new Phase("force-delete.response", Delete.ResponsePhase),
  ],
  [HandlerTypes.PATCH]: [
    new Phase("patch.URLSearchParamPhase", URLSearchParamPhase),
    new Phase("patch.prepareQuery", Single.PrepareGetPhase),
    new Hook(HookFunctionTypes.onBeforeUpdateQuery),
    new Event(HookFunctionTypes.onBeforeUpdateQuery),
    new Phase("patch.query", Single.GetPhase),
    new Hook(HookFunctionTypes.onAfterUpdateQuery),
    new Event(HookFunctionTypes.onAfterUpdateQuery),
    new Phase("patch.prepareAction", Patch.PrepareActionPhase),
    new Hook(HookFunctionTypes.onBeforeUpdate),
    new Event(HookFunctionTypes.onBeforeUpdate),
    new Phase("patch.action", Update.ActionPhase),
    new Hook(HookFunctionTypes.onAfterUpdate),
    new Event(HookFunctionTypes.onAfterUpdate),
    new Phase("patch.cleanCleanTags", CacheTagCleanPhase),
    new Phase("patch.serialize", Single.SerializePhase),
    new Phase("patch.response", Single.ResultPhase),
  ],
  [HandlerTypes.ALL]: [
    new Phase("all.cache", GetCachePhase),
    new Phase("all.URLSearchParamPhase", URLSearchParamPhase),
    new Phase("all.prepareQuery", Paginate.PreparePhase),
    new Hook(HookFunctionTypes.onBeforePaginate),
    new Event(HookFunctionTypes.onBeforePaginate),
    new Phase("all.query", All.FetchPhase),
    new Phase("all.relational", List.RelationalPhase),
    new Hook(HookFunctionTypes.onAfterPaginate),
    new Event(HookFunctionTypes.onAfterPaginate),
    new Phase("all.serialize", List.SerializePhase),
    new Phase("all.response", List.ResultPhase),
  ],
};

export const DEFAULT_CACHE_CONFIGURATION: ICacheConfiguration = {
  enable: false,
  ttl: 100,
  invalidation: CacheStrategies.TimeBased,
  tagPrefix: "tag",
  cachePrefix: "axe-cache",
  responseHeader: "X-Axe-API-Cache",
  cacheKey: defaultCacheKeyFunction,
};

export const DEFAULT_APP_CONFIG: AxeConfig = {
  prefix: "api",
  env: "production",
  port: 3000,
  docs: true,
  pino: {
    level: "error",
    transport: {
      target: "pino-pretty",
    },
  },
  rateLimit: {
    enabled: false,
    adaptor: "memory",
    maxRequests: 200,
    windowInSeconds: 5,
    trustProxyIP: false,
  },
  database: {
    client: "sqlite",
    connection: {
      filename: "./axedb.sql",
    },
  },
  errorHandler: ErrorHandler,
  redis: {
    url: "redis://127.0.0.1:6379",
  },
  cache: { ...DEFAULT_CACHE_CONFIGURATION },
  elasticSearch: {
    node: "http://localhost:9200",
  },
  search: {
    indexPrefix: "axe",
  },
};

export const DEFAULT_VERSION_CONFIG: AxeVersionConfig = {
  transaction: false,
  serializers: [],
  supportedLanguages: ["en"],
  defaultLanguage: "en",
  query: {
    limits: [
      allow(QueryFeature.All),
      deny(QueryFeature.WithHasMany),
      deny(QueryFeature.WhereLike),
      deny(QueryFeature.WhereNotLike),
      deny(QueryFeature.Trashed),
    ],
    defaults: {
      perPage: 10,
      minPerPage: 1,
      maxPerPage: 100,
    },
  },
  formidable: {},
  cache: null,
};

export const ALL_HANDLERS = [
  HandlerTypes.ALL,
  HandlerTypes.DELETE,
  HandlerTypes.FORCE_DELETE,
  HandlerTypes.INSERT,
  HandlerTypes.PAGINATE,
  HandlerTypes.PATCH,
  HandlerTypes.SHOW,
  HandlerTypes.UPDATE,
];
