import {
  ConditionTypes,
  HandlerTypes,
  QueryFeature,
  Relationships,
} from "./Enums";
import { IVersionConfig } from "./Interfaces";
import { allow, deny } from "./Services/LimitService";

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
