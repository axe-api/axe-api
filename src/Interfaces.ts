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
} from "./Enums";
import Model from "./Model";
import {
  AdaptorType,
  AxeFunction,
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

export interface IColumn extends Column {
  table_name: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IConfig {}

export interface IHandlerBasedTransactionConfig {
  handlers: HandlerTypes[];
  transaction: boolean;
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

export interface IRedisOptions {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
}

export interface IRateLimitAdaptorConfig {
  type: AdaptorType;
  redis?: IRedisOptions;
}

export interface IRateLimitOptions {
  maxRequests: number;
  windowInSeconds: number;
}

export interface IRateLimitConfig extends IRateLimitOptions {
  enabled: boolean;
  adaptor: IRateLimitAdaptorConfig;
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
}

export type IVersionConfig = Partial<AxeVersionConfig>;

export interface AxeConfig extends IConfig {
  env: string;
  port: number;
  prefix: string;
  database: Knex.Config;
  pino: LoggerOptions;
  rateLimit: IRateLimitConfig;
  errorHandler: ErrorHandleFunction;
  docs: boolean;
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
}

export interface IRelation {
  type: Relationships;
  name: string;
  model: string;
  primaryKey: string;
  foreignKey: string;
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
  queryParser?: QueryService;
  conditions?: IQuery;
  query?: Knex.QueryBuilder;
  params?: any;
  result?: any;
  item?: any;
  formData?: any;
}

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
  customHandler?: HandlerFunction;
}
