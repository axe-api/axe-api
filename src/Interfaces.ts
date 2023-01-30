import { Knex } from "knex";
import { Express, Request, Response, NextFunction } from "express";
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
} from "./Enums";
import Model from "./Model";

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
  serializer: ((data: any, request: Request) => void)[];
}

export interface IApplicationConfig extends IConfig {
  env: string;
  port: number;
  logLevel: LogLevels;
  prefix: string;
  transaction:
    | boolean
    | IHandlerBasedTransactionConfig
    | IHandlerBasedTransactionConfig[];
  serializers:
    | ((data: any, request: Request) => void)[]
    | IHandlerBasedSerializer[];
  supportedLanguages: string[];
  defaultLanguage: string;
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

export interface IFolders {
  App: string;
  Config: string;
  Events: string;
  Hooks: string;
  Middlewares: string;
  Models: string;
}

export interface IGeneralHooks {
  onBeforeInit: (app: Express) => void | null;
  onAfterInit: (app: Express) => void | null;
}

export interface IHandlerBaseMiddleware {
  handler: HandlerTypes[];
  middleware: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}

export interface IHookParameter {
  req: Request;
  res: Response;
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

  setColumns(columns: IColumn[]): void;
  setExtensions(
    type: Extensions,
    hookFunctionType: HookFunctionTypes,
    data: (params: IHookParameter) => void
  ): void;
}

export interface IRelation {
  type: Relationships;
  name: string;
  model: string;
  primaryKey: string;
  foreignKey: string;
}

export interface IRequestPack {
  req: Request;
  res: Response;
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
