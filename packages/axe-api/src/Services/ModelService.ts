import { HookFunctionTypes, Extensions, HandlerTypes } from "../Enums";
import {
  ICacheConfiguration,
  IColumn,
  IModelService,
  IQueryLimitConfig,
  IRelation,
} from "../Interfaces";
import Model from "./../Model";
import { ModelHooks, PhaseFunction, SerializationFunction } from "../Types";

class ModelService implements IModelService {
  name: string;
  instance: Model;
  relations: IRelation[];
  columns: IColumn[];
  columnNames: string[];
  hooks: ModelHooks = {} as ModelHooks;
  events: ModelHooks = {} as ModelHooks;
  children: IModelService[];
  isRecursive: boolean;
  queryLimits: IQueryLimitConfig[];
  serialize: SerializationFunction | null;
  cacheConfiguration: Record<string, ICacheConfiguration>;

  constructor(name: string, instance: Model) {
    this.name = name;
    this.instance = instance;
    this.relations = [];
    this.columns = [];
    this.columnNames = [];
    this.children = [];
    this.isRecursive = false;
    this.queryLimits = [];
    this.serialize = null;
    this.cacheConfiguration = {};
  }

  setColumns(columns: IColumn[]) {
    this.columns = columns;
    this.columnNames = this.columns.map((i) => i.name);
  }

  setCacheConfiguration(handler: string, cache: ICacheConfiguration) {
    this.cacheConfiguration[handler] = cache;
  }

  getCacheConfiguration(handler: HandlerTypes) {
    return this.cacheConfiguration[handler];
  }

  setExtensions(
    type: Extensions,
    hookFunctionType: HookFunctionTypes,
    data: PhaseFunction,
  ) {
    if (type == Extensions.Hooks) {
      this.setHooks(hookFunctionType, data);
    } else if (type == Extensions.Events) {
      this.setEvents(hookFunctionType, data);
    } else {
      throw new Error("Undefined hook type.");
    }
  }

  setQueryLimits(limits: IQueryLimitConfig[]) {
    this.queryLimits = limits;
  }

  setSerialization(callback: SerializationFunction) {
    this.serialize = callback;
  }

  setAsRecursive() {
    this.isRecursive = true;
    this.children = [];
  }

  private setHooks(hookFunctionType: HookFunctionTypes, data: PhaseFunction) {
    if (this.hooks[hookFunctionType]) {
      throw new Error(
        `You can define only one hook function: ${this.name}.${hookFunctionType}`,
      );
    }
    this.hooks[hookFunctionType] = data;
  }

  private setEvents(hookFunctionType: HookFunctionTypes, data: PhaseFunction) {
    if (this.events[hookFunctionType]) {
      throw new Error(
        `You can define only one event function: ${this.name}.${hookFunctionType}`,
      );
    }

    this.events[hookFunctionType] = data;
  }
}

export default ModelService;
