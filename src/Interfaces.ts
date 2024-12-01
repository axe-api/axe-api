import { Knex } from "knex";
import { Options as FormOptions } from "formidable";
import { Column } from "knex-schema-inspector/lib/types/column";
import {
  HandlerTypes,
  HttpMethods,
  HookFunctionTypes,
  Extensions,
  Relationships,
  SortTypes,
  ConditionTypes,
  DependencyTypes,
  QueryFeature,
  QueryFeatureType,
  CacheStrategies,
} from "./Enums";
import Model from "./Model";
import {
  AdaptorType,
  AxeFunction,
  FormValidatorLibrary,
  GeneralFunction,
  HandlerFunction,
  ModelHooks,
  PhaseFunction,
  SerializationFunction,
} from "./Types";
import { ModelListService, QueryService } from "./Services";
import AxeRequest from "./Services/AxeRequest";
import AxeResponse from "./Services/AxeResponse";
import App from "./Services/App";
import { LoggerOptions } from "pino";
import { IncomingMessage } from "http";
import { ErrorHandleFunction } from "connect";
import { RedisClientOptions } from "redis";
import { ClientOptions } from "@elastic/elasticsearch";

export interface IColumn extends Column {
  table_name: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IConfig {}

export interface IHandlerBasedTransactionConfig {
  handlers: HandlerTypes[];
  transaction: boolean;
}

export interface IHandlerBasedCacheConfig {
  handlers: HandlerTypes[];
  cache: ICacheConfiguration;
}

interface IHandlerBasedSerializer {
  handler: HandlerTypes[];
  serializer: ((data: any, request: AxeRequest) => void)[];
}

export interface IQueryLimitConfig {
  feature: QueryFeature;
  type: QueryFeatureType;
  key: string | null;
}

export interface IQueryDefaultConfig {
  perPage?: number;
  minPerPage?: number;
  maxPerPage?: number;
}

export interface IQueryConfig {
  limits: Array<IQueryLimitConfig[]>;
  defaults?: IQueryDefaultConfig;
}

export interface IRateLimitOptions {
  maxRequests: number;
  windowInSeconds: number;
}

export interface IRateLimitIdentifier extends IRateLimitOptions {
  name: string;
  clientKey: string;
  setResponseHeaders?: boolean;
}

export interface IRateLimitConfig extends IRateLimitOptions {
  enabled: boolean;
  adaptor: AdaptorType;
  trustProxyIP: boolean;
  keyGenerator?: (req: IncomingMessage) => string;
}

export interface AxeVersionConfig {
  transaction:
    | boolean
    | IHandlerBasedTransactionConfig
    | IHandlerBasedTransactionConfig[];
  serializers:
    | ((data: any, request: AxeRequest) => void)[]
    | IHandlerBasedSerializer[];
  supportedLanguages: string[];
  defaultLanguage: string;
  query: IQueryConfig;
  formidable: FormOptions;
  cache: ICacheConfiguration | null;
}

export type IVersionConfig = Partial<AxeVersionConfig>;

export interface ICacheConfiguration {
  enable?: boolean;
  ttl?: number;
  invalidation?: CacheStrategies;
  cachePrefix?: string;
  tagPrefix?: string;
  responseHeader?: string | null;
  cacheKey?: (req: AxeRequest) => string;
}

export interface ISearchConfigutation {
  indexPrefix: string;
}

export interface AxeConfig extends IConfig {
  env: string;
  port: number;
  hostname: string;
  prefix: string;
  database: Knex.Config;
  pino: LoggerOptions;
  rateLimit: IRateLimitConfig;
  errorHandler: ErrorHandleFunction;
  docs: boolean;
  disableXPoweredByHeader: boolean;
  redis: RedisClientOptions | undefined;
  cache: ICacheConfiguration;
  elasticSearch: ClientOptions;
  search: ISearchConfigutation;
  validator: FormValidatorLibrary;
}

export type IApplicationConfig = Partial<AxeConfig>;

export interface ILanguage {
  title: string;
  language: string;
  region?: string | null;
}

export interface IAcceptedLanguage {
  language: ILanguage;
  quality: number;
}

export interface IVersionFolder {
  root: string;
  config: string;
  events: string;
  hooks: string;
  middlewares: string;
  models: string;
  serialization: string;
}

export interface IVersion {
  name: string;
  config: AxeVersionConfig;
  folders: IVersionFolder;
  modelList: ModelListService;
  modelTree: IModelService[];
}

export interface IAPI {
  rootFolder: string;
  appFolder: string;
  versions: IVersion[];
  config: AxeConfig;
}

export interface IGeneralHooks {
  onBeforeInit: (app: App) => void | null;
  onAfterInit: (app: App) => void | null;
}

export interface IHandlerBaseMiddleware {
  handler: HandlerTypes[];
  middleware: AxeFunction;
}

export interface IMethodBaseConfig<T> {
  [HttpMethods.POST]?: T;
  [HttpMethods.PUT]?: T;
  [HttpMethods.PATCH]?: T;
}

export interface IModelService {
  name: string;
  instance: Model;
  relations: IRelation[];
  columns: IColumn[];
  columnNames: string[];
  hooks: ModelHooks;
  events: ModelHooks;
  isRecursive: boolean;
  children: IModelService[];
  queryLimits: IQueryLimitConfig[];
  serialize: SerializationFunction | null;

  setColumns(columns: IColumn[]): void;
  setExtensions(
    type: Extensions,
    hookFunctionType: HookFunctionTypes,
    data: PhaseFunction,
  ): void;
  setQueryLimits(limits: IQueryLimitConfig[]): void;
  setSerialization(callback: SerializationFunction): void;
  setCacheConfiguration(handler: string, cache: ICacheConfiguration): void;
  getCacheConfiguration(handler: HandlerTypes): ICacheConfiguration | null;
  setAsRecursive(): void;
}

export interface IRelation {
  type: Relationships;
  name: string;
  model: string;
  primaryKey: string;
  foreignKey: string;
  options: IHasManyOptions;
}

export interface IRouteData {
  version: IVersion;
  handlerType: HandlerTypes;
  model: IModelService;
  parentModel: IModelService | null;
  relation: IRelation | null;
}

export interface IContext extends IRouteData {
  api: IAPI;
  req: AxeRequest;
  res: AxeResponse;
  database: Knex | Knex.Transaction;
  isTransactionOpen: boolean;
  validator: IValidator;
  queryParser?: QueryService;
  params?: any;
  conditions?: IQuery;
  query?: Knex.QueryBuilder;
  result?: any;
  item?: any;
  formData?: any;
}

export interface IBeforeInsertContext extends IContext {
  formData: any;
}

export interface IBeforeUpdateQueryContext extends IContext {
  query: Knex.QueryBuilder;
}

export interface IBeforePatchQueryContext extends IContext {
  query: Knex.QueryBuilder;
}

export interface IBeforeUpdateContext extends IContext {
  query: Knex.QueryBuilder;
  item: any;
  formData: any;
}

export interface IBeforePatchContext extends IContext {
  query: Knex.QueryBuilder;
  item: any;
  formData: any;
}

export interface IBeforeDeleteQueryContext extends IContext {
  query: Knex.QueryBuilder;
}

export interface IBeforeDeleteContext extends IContext {
  query: Knex.QueryBuilder;
}

export interface IBeforeForceDeleteQueryContext extends IContext {
  query: Knex.QueryBuilder;
}

export interface IBeforeForceDeleteContext extends IContext {
  query: Knex.QueryBuilder;
}

export interface IBeforePaginateContext extends IContext {
  query: Knex.QueryBuilder;
  conditions: IQuery;
}

export interface IBeforeSearchContext extends IContext {
  query: Knex.QueryBuilder;
  conditions: IQuery;
}

export interface IBeforeAllContext extends IContext {
  query: Knex.QueryBuilder;
  conditions: IQuery;
}

export interface IBeforeShowContext extends IContext {
  query: Knex.QueryBuilder;
  conditions: IQuery;
}

export interface IAfterInsertContext extends IContext {
  item: any;
  formData: any;
}

export interface IAfterUpdateQueryContext extends IContext {
  query: Knex.QueryBuilder;
  item: any;
}

export interface IAfterUpdateContext extends IContext {
  query: Knex.QueryBuilder;
  item: any;
  formData: any;
}

export interface IAfterPatchQueryContext extends IContext {
  query: Knex.QueryBuilder;
  item: any;
}

export interface IAfterPatchContext extends IContext {
  query: Knex.QueryBuilder;
  item: any;
  formData: any;
}

export interface IAfterDeleteQueryContext extends IContext {
  query: Knex.QueryBuilder;
  item: any;
}

export interface IAfterDeleteContext extends IContext {
  item: any;
}

export interface IAfterForceDeleteQueryContext extends IContext {
  query: Knex.QueryBuilder;
  item: any;
}

export interface IAfterForceDeleteContext extends IContext {
  item: any;
}

export interface IAfterPaginateContext extends IContext {
  query: Knex.QueryBuilder;
  conditions: IQuery;
  result: any;
}

export interface IAfterAllContext extends IContext {
  query: Knex.QueryBuilder;
  conditions: IQuery;
  result: any;
}

export interface IAfterSearchContext extends IContext {
  query: Knex.QueryBuilder;
  conditions: IQuery;
  result: any;
}

export interface IAfterShowContext extends IContext {
  query: Knex.QueryBuilder;
  conditions: IQuery;
  item: any;
}

export interface IBeforeInsertEventContext
  extends Omit<IBeforeInsertContext, "res"> {}
export interface IBeforeUpdateQueryEventContext
  extends Omit<IBeforeUpdateQueryContext, "res"> {}
export interface IBeforePatchQueryEventContext
  extends Omit<IBeforePatchQueryContext, "res"> {}
export interface IBeforeUpdateEventContext
  extends Omit<IBeforeUpdateContext, "res"> {}
export interface IBeforePatchEventContext
  extends Omit<IBeforePatchContext, "res"> {}
export interface IBeforeDeleteQueryEventContext
  extends Omit<IBeforeDeleteQueryContext, "res"> {}
export interface IBeforeDeleteEventContext
  extends Omit<IBeforeDeleteContext, "res"> {}
export interface IBeforeForceDeleteQueryEventContext
  extends Omit<IBeforeForceDeleteQueryContext, "res"> {}
export interface IBeforeForceDeleteEventContext
  extends Omit<IBeforeForceDeleteContext, "res"> {}
export interface IBeforePaginateEventContext
  extends Omit<IBeforePaginateContext, "res"> {}
export interface IBeforeSearchEventContext
  extends Omit<IBeforeSearchContext, "res"> {}
export interface IBeforeAllEventContext
  extends Omit<IBeforeAllContext, "res"> {}
export interface IBeforeShowEventContext
  extends Omit<IBeforeShowContext, "res"> {}
export interface IAfterInsertEventContext
  extends Omit<IAfterInsertContext, "res"> {}
export interface IAfterUpdateQueryEventContext
  extends Omit<IAfterUpdateQueryContext, "res"> {}
export interface IAfterUpdateEventContext
  extends Omit<IAfterUpdateContext, "res"> {}
export interface IAfterPatchQueryEventContext
  extends Omit<IAfterPatchQueryContext, "res"> {}
export interface IAfterPatchEventContext
  extends Omit<IAfterPatchContext, "res"> {}
export interface IAfterDeleteQueryEventContext
  extends Omit<IAfterDeleteQueryContext, "res"> {}
export interface IAfterDeleteEventContext
  extends Omit<IAfterDeleteContext, "res"> {}
export interface IAfterForceDeleteQueryEventContext
  extends Omit<IAfterForceDeleteQueryContext, "res"> {}
export interface IAfterForceDeleteEventContext
  extends Omit<IAfterForceDeleteContext, "res"> {}
export interface IAfterPaginateEventContext
  extends Omit<IAfterPaginateContext, "res"> {}
export interface IAfterAllEventContext extends Omit<IAfterAllContext, "res"> {}
export interface IAfterSearchEventContext
  extends Omit<IAfterSearchContext, "res"> {}
export interface IAfterShowEventContext
  extends Omit<IAfterShowContext, "res"> {}

export interface IRouteDocumentation {
  version: string;
  handler: string;
  modelService: IModelService;
  parentModel: IModelService | null;
  model: string;
  table: string;
  columns: IColumn[];
  hiddens: string[];
  relations: IRelation[];
  method: HttpMethods;
  url: string;
  fillables: string[];
  validations: Record<string, string> | null;
  queryLimits: IQueryLimitConfig[];
  queryDefaults: IQueryDefaultConfig;
}

export interface ICustomRouteDocumentation {
  method: HttpMethods;
  url: string;
}

export interface IRawQuery {
  q: string | null;
  page: string | null;
  per_page: string | null;
  sort: string | null;
  fields: string | null;
  with: string | null;
  trashed: string | null;
}

export interface ISortField {
  name: string;
  type: SortTypes;
}

export interface IWith {
  relationship: string;
  relationModel: IModelService;
  fields: string[];
  children: IWith[];
}

export interface IQuery {
  q: NestedWhere;
  page: number;
  per_page: number;
  sort: ISortField[];
  fields: string[];
  with: IWith[];
  trashed: boolean;
  text: string | null;
}

export interface IWhere {
  prefix: string | null;
  model: IModelService;
  table: string;
  field: string;
  condition: ConditionTypes;
  value: any;
  relation: IRelation | null;
}

export type NestedWhere = Array<NestedWhere | IWhere>;

export interface IDependency {
  type: DependencyTypes;
  callback: any;
  instance: any;
}

export interface IPhaseDefinition {
  name: string;
  isAsync: boolean;
  callback: PhaseFunction;
}

export interface AxeRequestResponsePair {
  axeRequest: AxeRequest;
  axeResponse: AxeResponse;
}

export interface MiddlewareResolution {
  middlewares: GeneralFunction[];
  handler: HandlerFunction;
}

export interface IStepDefinition {
  name: string;
  get(model: IModelService): PhaseFunction;
  isAsync(): boolean;
}

export interface ICacheAdaptor {
  get(key: string): Promise<string | null>;

  set(key: string, value: string, ttl: number): Promise<void>;

  decr(key: string, ttl: number): Promise<void>;
}

export interface IRateLimitResponse {
  success: boolean;
  limit: number;
  remaining: number;
}

export interface IURLPair {
  method: string;
  pattern: string;
  data: IRouteData;
  phases: IPhaseDefinition[];
  hasTransaction: boolean;
  params?: any;
  parentPairs: IRouteParentPair[];
  customHandler?: HandlerFunction;
}

export interface BulkTask<DataType, ReturnType> {
  data: DataType;
  promise: Promise<ReturnType>;
}

export interface IForeignKeyTask {
  relation: IRelation;
  value: any;
}

export interface IRouteParentPair {
  model: IModelService;
  paramName: string;
}

export interface IElasticSearchParameters {
  req: AxeRequest;
  model: IModelService;
  relation: IRelation | null;
  parentModel: IModelService | null;
  text: string;
}

export interface IHasManyOptions {
  autoRouting: boolean;
  onBeforeQuery?: (req: AxeRequest, query: Knex.QueryBuilder) => Promise<void>;
}

export interface IValidator {
  validate: (
    req: AxeRequest,
    model: IModelService,
    formData: any,
  ) => Promise<null | IValidationError>;
}

export interface IValidationError {
  errors: Record<string, string[]>;
}
