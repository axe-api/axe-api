import {
  ConditionTypes,
  HandlerTypes,
  HookFunctionTypes,
  HttpMethods,
  QueryFeature,
  Relationships,
} from "./Enums";
import { IModelService, IVersionConfig } from "./Interfaces";
import { allow, deny } from "./Services/LimitService";
import { PhaseFunction } from "./Types";
import Single from "./Phases/Single";
import List from "./Phases/List";
import Paginate from "./Phases/Paginate";
import All from "./Phases/All";
import Show from "./Phases/Show";
import Store from "./Phases/Store";
import Update from "./Phases/Update";
import Patch from "./Phases/Patch";
import Delete from "./Phases/Delete";
import ForceDelete from "./Phases/ForceDelete";

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

export const STRING_COLUMN_TYPES = [
  "CHAR",
  "VARCHAR",
  "BINARY",
  "VARBINARY",
  "BLOB",
  "TEXT",
  "ENUM",
  "SET",
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
};

export interface ICycleDefinition {
  get(model: IModelService): PhaseFunction;
  isAsync(): boolean;
}

class Phase implements ICycleDefinition {
  private callback: PhaseFunction;

  constructor(callback: PhaseFunction) {
    this.callback = callback;
  }

  get(): PhaseFunction {
    return this.callback;
  }

  isAsync() {
    return true;
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

  isAsync() {
    return true;
  }
}

class Event implements ICycleDefinition {
  private hookFunctionType: HookFunctionTypes;

  constructor(hookFunctionType: HookFunctionTypes) {
    this.hookFunctionType = hookFunctionType;
  }

  get(model: IModelService): PhaseFunction {
    return model.events[this.hookFunctionType];
  }

  isAsync() {
    return false;
  }
}

export const HANDLER_CYLES: Record<HandlerTypes, ICycleDefinition[]> = {
  [HandlerTypes.INSERT]: [
    new Phase(Store.PreparePhase),
    new Hook(HookFunctionTypes.onBeforeInsert),
    new Event(HookFunctionTypes.onBeforeInsert),
    new Phase(Store.ActionPhase),
    new Hook(HookFunctionTypes.onAfterInsert),
    new Event(HookFunctionTypes.onAfterInsert),
    new Phase(Single.SerializePhase),
    new Phase(Single.ResultPhase),
  ],
  [HandlerTypes.PAGINATE]: [
    new Phase(Paginate.PreparePhase),
    new Hook(HookFunctionTypes.onBeforePaginate),
    new Event(HookFunctionTypes.onBeforePaginate),
    new Phase(Paginate.FetchPhase),
    new Phase(List.RelationalPhase),
    new Hook(HookFunctionTypes.onAfterPaginate),
    new Event(HookFunctionTypes.onAfterPaginate),
    new Phase(List.SerializePhase),
    new Phase(List.ResultPhase),
  ],
  [HandlerTypes.SHOW]: [
    new Phase(Show.PreparePhase),
    new Hook(HookFunctionTypes.onBeforeShow),
    new Event(HookFunctionTypes.onBeforeShow),
    new Phase(Show.FetchPhase),
    new Phase(Single.RelationalPhase),
    new Hook(HookFunctionTypes.onAfterShow),
    new Event(HookFunctionTypes.onAfterShow),
    new Phase(Single.SerializePhase),
    new Phase(Single.ResultPhase),
  ],
  [HandlerTypes.UPDATE]: [
    new Phase(Single.PrepareGetPhase),
    new Hook(HookFunctionTypes.onBeforeUpdateQuery),
    new Event(HookFunctionTypes.onBeforeUpdateQuery),
    new Phase(Single.GetPhase),
    new Hook(HookFunctionTypes.onAfterUpdateQuery),
    new Event(HookFunctionTypes.onAfterUpdateQuery),
    new Phase(Update.PrepareActionPhase),
    new Hook(HookFunctionTypes.onBeforeUpdate),
    new Event(HookFunctionTypes.onBeforeUpdate),
    new Phase(Update.ActionPhase),
    new Hook(HookFunctionTypes.onAfterUpdate),
    new Event(HookFunctionTypes.onAfterUpdate),
    new Phase(Single.SerializePhase),
    new Phase(Single.ResultPhase),
  ],
  [HandlerTypes.DELETE]: [
    new Phase(Delete.PreparePhase),
    new Hook(HookFunctionTypes.onBeforeDeleteQuery),
    new Event(HookFunctionTypes.onBeforeDeleteQuery),
    new Phase(Delete.QueryPhase),
    new Hook(HookFunctionTypes.onAfterDeleteQuery),
    new Event(HookFunctionTypes.onAfterDeleteQuery),
    new Hook(HookFunctionTypes.onBeforeDelete),
    new Event(HookFunctionTypes.onBeforeDelete),
    new Phase(Delete.ActionPhase),
    new Hook(HookFunctionTypes.onAfterDelete),
    new Event(HookFunctionTypes.onAfterDelete),
    new Phase(Delete.ResponsePhase),
  ],
  [HandlerTypes.FORCE_DELETE]: [
    new Phase(ForceDelete.PreparePhase),
    new Hook(HookFunctionTypes.onBeforeForceDeleteQuery),
    new Event(HookFunctionTypes.onBeforeForceDeleteQuery),
    new Phase(ForceDelete.QueryPhase),
    new Hook(HookFunctionTypes.onAfterForceDeleteQuery),
    new Event(HookFunctionTypes.onAfterForceDeleteQuery),
    new Hook(HookFunctionTypes.onBeforeForceDelete),
    new Event(HookFunctionTypes.onBeforeForceDelete),
    new Phase(ForceDelete.ActionPhase),
    new Hook(HookFunctionTypes.onAfterForceDelete),
    new Event(HookFunctionTypes.onAfterForceDelete),
    new Phase(Delete.ResponsePhase),
  ],
  [HandlerTypes.PATCH]: [
    new Phase(Single.PrepareGetPhase),
    new Hook(HookFunctionTypes.onBeforeUpdateQuery),
    new Event(HookFunctionTypes.onBeforeUpdateQuery),
    new Phase(Single.GetPhase),
    new Hook(HookFunctionTypes.onAfterUpdateQuery),
    new Event(HookFunctionTypes.onAfterUpdateQuery),
    new Phase(Patch.PrepareActionPhase),
    new Hook(HookFunctionTypes.onBeforeUpdate),
    new Event(HookFunctionTypes.onBeforeUpdate),
    new Phase(Update.ActionPhase),
    new Hook(HookFunctionTypes.onAfterUpdate),
    new Event(HookFunctionTypes.onAfterUpdate),
    new Phase(Single.SerializePhase),
    new Phase(Single.ResultPhase),
  ],
  [HandlerTypes.ALL]: [
    new Phase(Paginate.PreparePhase),
    new Hook(HookFunctionTypes.onBeforePaginate),
    new Event(HookFunctionTypes.onBeforePaginate),
    new Phase(All.FetchPhase),
    new Phase(List.RelationalPhase),
    new Hook(HookFunctionTypes.onAfterPaginate),
    new Event(HookFunctionTypes.onAfterPaginate),
    new Phase(List.SerializePhase),
    new Phase(List.ResultPhase),
  ],
};
