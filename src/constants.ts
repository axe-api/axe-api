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
  formidable: {},
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
  name: string;
  get(model: IModelService): PhaseFunction;
  isAsync(): boolean;
}

class Phase implements ICycleDefinition {
  private callback: PhaseFunction;
  private phaseName: string;

  constructor(name: string, callback: PhaseFunction) {
    this.phaseName = name;
    this.callback = callback;
  }

  get(): PhaseFunction {
    return this.callback;
  }

  get name() {
    return this.phaseName;
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

  get name() {
    return `hook:${this.hookFunctionType}`;
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

  get name() {
    return `event:${this.hookFunctionType}`;
  }

  isAsync() {
    return false;
  }
}

export const HANDLER_CYLES: Record<HandlerTypes, ICycleDefinition[]> = {
  [HandlerTypes.INSERT]: [
    new Phase("insert.prepare", Store.PreparePhase),
    new Hook(HookFunctionTypes.onBeforeInsert),
    new Event(HookFunctionTypes.onBeforeInsert),
    new Phase("insert.action", Store.ActionPhase),
    new Hook(HookFunctionTypes.onAfterInsert),
    new Event(HookFunctionTypes.onAfterInsert),
    new Phase("insert.serialize", Single.SerializePhase),
    new Phase("insert.response", Single.ResultPhase),
  ],
  [HandlerTypes.PAGINATE]: [
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
  [HandlerTypes.SHOW]: [
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
    new Phase("update.serialize", Single.SerializePhase),
    new Phase("update.response", Single.ResultPhase),
  ],
  [HandlerTypes.DELETE]: [
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
    new Phase("delete.response", Delete.ResponsePhase),
  ],
  [HandlerTypes.FORCE_DELETE]: [
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
    new Phase("force-delete.response", Delete.ResponsePhase),
  ],
  [HandlerTypes.PATCH]: [
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
    new Phase("patch.serialize", Single.SerializePhase),
    new Phase("patch.response", Single.ResultPhase),
  ],
  [HandlerTypes.ALL]: [
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
