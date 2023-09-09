import { Knex } from "knex";
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
import { PhaseFunction, SerializationFunction } from "./Types";
import { ModelListService, QueryService } from "./Services";
import AxeRequest from "./Services/AxeRequest";
import AxeResponse from "./Services/AxeResponse";
import App from "./Services/App";
import { LoggerOptions } from "pino";

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

export interface IVersionConfig {
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
}

export interface IApplicationConfig extends IConfig {
  env: string;
  port: number;
  prefix: string;
  database: IDatabaseConfig;
  pino: LoggerOptions;
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
  onBeforeInit: (app: App) => void | null;
  onAfterInit: (app: App) => void | null;
}

export interface IHandlerBaseMiddleware {
  handler: HandlerTypes[];
  middleware: (context: IRequestPack) => Promise<void> | void;
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
  hooks: Record<HookFunctionTypes, PhaseFunction>;
  events: Record<HookFunctionTypes, PhaseFunction>;
  isRecursive: boolean;
  children: IModelService[];
  queryLimits: IQueryLimitConfig[];
  serialize: SerializationFunction | null;

  setColumns(columns: IColumn[]): void;
  setExtensions(
    type: Extensions,
    hookFunctionType: HookFunctionTypes,
    data: PhaseFunction
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

export interface IRequestPack extends IRouteData {
  api: IAPI;
  req: AxeRequest;
  res: AxeResponse;
  database: Knex | Knex.Transaction;
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
