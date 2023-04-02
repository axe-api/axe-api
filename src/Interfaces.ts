import { Knex } from "knex";
import { NextFunction, Express } from "express";
import { Column } from "knex-schema-inspector/lib/types/column";
import {
  HandlerTypes,
  LogLevels,
  HttpMethods,
  HookFunctionTypes,
  Extensions,
  Relationships,
  SortTypes,
  ConditionTypes,
  DependencyTypes,
  Frameworks,
  QueryFeature,
  QueryFeatureType,
} from "./Enums";
import Model from "./Model";
import { SerializationFunction } from "./Types";
import { ModelListService } from "./Services";

export interface IColumn extends Column {
  table_name: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IConfig {}

export interface IHandlerBasedTransactionConfig {
  handler: HandlerTypes | HandlerTypes[];
  transaction: boolean;
}

interface IHandlerBasedSerializer {
  handler: HandlerTypes[];
  serializer: ((data: any, request: IRequest) => void)[];
}

export interface IQueryLimitConfig {
  feature: QueryFeature;
  type: QueryFeatureType;
  key: string | null;
}

export interface IQueryConfig {
  limits: Array<IQueryLimitConfig[]>;
}

export interface IVersionConfig {
  transaction:
    | boolean
    | IHandlerBasedTransactionConfig
    | IHandlerBasedTransactionConfig[];
  serializers:
    | ((data: any, request: IRequest) => void)[]
    | IHandlerBasedSerializer[];
  supportedLanguages: string[];
  defaultLanguage: string;
  query: IQueryConfig;
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

export interface IVersionConfig {
  transaction:
    | boolean
    | IHandlerBasedTransactionConfig
    | IHandlerBasedTransactionConfig[];
  serializers:
    | ((data: any, request: IRequest) => void)[]
    | IHandlerBasedSerializer[];
  supportedLanguages: string[];
  defaultLanguage: string;
  query: IQueryConfig;
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

export interface IVersionConfig {
  transaction:
    | boolean
    | IHandlerBasedTransactionConfig
    | IHandlerBasedTransactionConfig[];
  serializers:
    | ((data: any, request: IRequest) => void)[]
    | IHandlerBasedSerializer[];
  supportedLanguages: string[];
  defaultLanguage: string;
  query: IQueryConfig;
}

export interface IApplicationConfig extends IConfig {
  env: string;
  port: number;
  logLevel: LogLevels;
  prefix: string;
  database: IDatabaseConfig;
  framework: Frameworks;
}

export interface ILanguage {
  title: string;
  language: string;
  region?: string | null;
}

export interface IAcceptedLanguage {
  language: ILanguage;
  quality: number;
}

export type IDatabaseConfig = Knex.Config;

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
  config: IVersionConfig;
  folders: IVersionFolder;
  modelList: ModelListService;
  modelTree: IModelService[];
}

export interface IAPI {
  rootFolder: string;
  appFolder: string;
  versions: IVersion[];
  config: IApplicationConfig;
}

export interface IGeneralHooks {
  onBeforeInit: (app: IFramework) => void | null;
  onAfterInit: (app: IFramework) => void | null;
}

export interface IHandlerBaseMiddleware {
  handler: HandlerTypes[];
  middleware: (
    req: IRequest,
    res: IResponse,
    next: NextFunction
  ) => void | Promise<void>;
}

export interface IHookParameter {
  req: IRequest;
  res: IResponse;
  handlerType: HandlerTypes;
  model: IModelService;
  parentModel: IModelService | null;
  relation: IRelation | null;
  database: Knex | Knex.Transaction;
  conditions: IQuery | null;
  query: Knex.QueryBuilder | null;
  result: any | null;
  item: any | null;
  formData: any | null;
}

export interface IMethodBaseConfig {
  [HttpMethods.POST]?: string[];
  [HttpMethods.PUT]?: string[];
  [HttpMethods.PATCH]?: string[];
}

export interface IMethodBaseValidations {
  [HttpMethods.POST]?: Record<string, string>;
  [HttpMethods.PUT]?: Record<string, string>;
}

export interface IModelService {
  name: string;
  instance: Model;
  relations: IRelation[];
  columns: IColumn[];
  columnNames: string[];
  hooks: Record<HookFunctionTypes, (params: IHookParameter) => void>;
  events: Record<HookFunctionTypes, (params: IHookParameter) => void>;
  isRecursive: boolean;
  children: IModelService[];
  queryLimits: IQueryLimitConfig[];
  serialize: SerializationFunction | null;

  setColumns(columns: IColumn[]): void;
  setExtensions(
    type: Extensions,
    hookFunctionType: HookFunctionTypes,
    data: (params: IHookParameter) => void
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

export interface AxeRequestPack {
  api: IAPI;
  version: IVersion;
  req: IRequest;
  res: IResponse;
  handlerType: HandlerTypes;
  model: IModelService;
  parentModel: IModelService | null;
  relation: IRelation | null;
  database: Knex | Knex.Transaction;
}

export interface IRouteDocumentation {
  model: string;
  table: string;
  columns: IColumn[];
  method: HttpMethods;
  url: string;
  fillables: string[];
  validations: Record<string, string> | null;
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

export type IFrameworkHandler = (
  req: IRequest,
  res: IResponse,
  next: any
) => Promise<any> | void;

export interface IFramework {
  name: Frameworks;
  init(): Promise<void>;
  get(
    url: string,
    middleware: IFrameworkHandler | IFrameworkHandler[],
    handler?: IFrameworkHandler
  ): any;
  post(
    url: string,
    middleware: IFrameworkHandler | IFrameworkHandler[],
    handler?: IFrameworkHandler
  ): any;
  put(
    url: string,
    middleware: IFrameworkHandler | IFrameworkHandler[],
    handler?: IFrameworkHandler
  ): any;
  delete(
    url: string,
    middleware: IFrameworkHandler | IFrameworkHandler[],
    handler?: IFrameworkHandler
  ): any;
  patch(
    url: string,
    middleware: IFrameworkHandler | IFrameworkHandler[],
    handler?: IFrameworkHandler
  ): any;
  use(middleware: IFrameworkHandler): any;
  listen(port: number, fn: () => void): any;
  kill(): void;
}

export interface IResponse {
  append(name: string, value: any): IResponse;
  attachment(path: string): IResponse;
  setCookie(name: string, value: string, options: any): IResponse;
  clearCookie(name: string, options: any): IResponse;
  status(status: number): IResponse;
  setHeader(name: string, value: string): IResponse;
  deleteHeader(name: string): IResponse;
  redirect(url: string): IResponse;
  send(data?: any): IResponse;
  json(data?: any): IResponse;
}

export interface IRequest {
  readonly path: string;
  readonly url: string;
  readonly method: string;
  readonly body: ReadableStream<Uint8Array> | any;
  readonly baseUrl: string;
  readonly hostname: string;
  readonly ip: string;
  readonly ips: string[];
  readonly originalUrl: string;
  readonly params: any;
  readonly protocol: string;
  readonly query: any;
  currentLanguage: ILanguage;

  getHeader(name: string): string | null;
  param(name: string): any;
}
