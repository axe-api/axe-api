import {
  ConditionTypes,
  HandlerTypes,
  HookFunctionTypes,
  HttpMethods,
  QueryFeature,
  Relationships,
} from "./Enums";
import { IModelService, IVersionConfig } from "./Interfaces";
import Model from "./Model";
import PaginatePhase from "./Phases/PaginatePhase";
import QueryPhase from "./Phases/QueryPhase";
import RelationalDataPhase from "./Phases/RelationalDataPhase";
import ResultPhase from "./Phases/ResultPhase";
import { allow, deny } from "./Services/LimitService";
import { PhaseFunction } from "./Types";

export const LOG_COLORS = {
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
];

export const API_ROUTE_TEMPLATES = {
  [HandlerTypes.INSERT]: (
    prefix: string,
    parentUrl: string,
    resource: string
  ) => `/${prefix}/${parentUrl}${resource}`,
  [HandlerTypes.PAGINATE]: (
    prefix: string,
    parentUrl: string,
    resource: string
  ) => `/${prefix}/${parentUrl}${resource}`,
  [HandlerTypes.ALL]: (prefix: string, parentUrl: string, resource: string) =>
    `/${prefix}/${parentUrl}${resource}/all`,
  [HandlerTypes.SHOW]: (
    prefix: string,
    parentUrl: string,
    resource: string,
    primaryKey: string
  ) => `/${prefix}/${parentUrl}${resource}/:${primaryKey}`,
  [HandlerTypes.UPDATE]: (
    prefix: string,
    parentUrl: string,
    resource: string,
    primaryKey: string
  ) => `/${prefix}/${parentUrl}${resource}/:${primaryKey}`,
  [HandlerTypes.PATCH]: (
    prefix: string,
    parentUrl: string,
    resource: string,
    primaryKey: string
  ) => `/${prefix}/${parentUrl}${resource}/:${primaryKey}`,
  [HandlerTypes.DELETE]: (
    prefix: string,
    parentUrl: string,
    resource: string,
    primaryKey: string
  ) => `/${prefix}/${parentUrl}${resource}/:${primaryKey}`,
  [HandlerTypes.FORCE_DELETE]: (
    prefix: string,
    parentUrl: string,
    resource: string,
    primaryKey: string
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
  [ConditionTypes["In"]]: QueryFeature.WhereIn,
  [ConditionTypes["NotIn"]]: QueryFeature.WhereNotIn,
  [ConditionTypes["Between"]]: QueryFeature.WhereBetween,
  [ConditionTypes["NotBetween"]]: QueryFeature.WhereNotBetween,
};

export const RelationQueryFeatureMap: Record<Relationships, QueryFeature> = {
  [Relationships.HAS_ONE]: QueryFeature.WithHasOne,
  [Relationships.HAS_MANY]: QueryFeature.WithHasMany,
};

export const DEFAULT_VERSION_CONFIG: IVersionConfig = {
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
};

export const NUMERIC_PRIMARY_KEY_TYPES = ["integer", "bigint"];

export const HANDLER_METHOD_MAP: Record<HandlerTypes, HttpMethods> = {
  [HandlerTypes.INSERT]: HttpMethods.POST,
  [HandlerTypes.PAGINATE]: HttpMethods.GET,
  [HandlerTypes.SHOW]: HttpMethods.GET,
  [HandlerTypes.UPDATE]: HttpMethods.PUT,
  [HandlerTypes.DELETE]: HttpMethods.DELETE,
  [HandlerTypes.FORCE_DELETE]: HttpMethods.DELETE,
  [HandlerTypes.PATCH]: HttpMethods.PATCH,
  [HandlerTypes.ALL]: HttpMethods.GET,
};

export interface ICycleDefinition {
  get(model: IModelService): PhaseFunction;
}

class Phase implements ICycleDefinition {
  private callback: PhaseFunction;

  constructor(callback: PhaseFunction) {
    this.callback = callback;
  }

  get(): PhaseFunction {
    return this.callback;
  }
}

class Hook implements ICycleDefinition {
  private hookFunctionType: HookFunctionTypes;

  constructor(hookFunctionType: HookFunctionTypes) {
    this.hookFunctionType = hookFunctionType;
  }

  get(model: IModelService): PhaseFunction {
    return model.hooks[this.hookFunctionType];
  }
}

export const HANDLER_CYLES: Record<HandlerTypes, ICycleDefinition[]> = {
  [HandlerTypes.INSERT]: [],
  [HandlerTypes.PAGINATE]: [
    new Phase(QueryPhase),
    new Hook(HookFunctionTypes.onBeforePaginate),
    new Phase(PaginatePhase),
    new Phase(RelationalDataPhase),
    new Hook(HookFunctionTypes.onAfterPaginate),
    new Phase(ResultPhase),
  ],
  [HandlerTypes.SHOW]: [],
  [HandlerTypes.UPDATE]: [],
  [HandlerTypes.DELETE]: [],
  [HandlerTypes.FORCE_DELETE]: [],
  [HandlerTypes.PATCH]: [],
  [HandlerTypes.ALL]: [],
};
