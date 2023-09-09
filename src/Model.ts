import pluralize from "pluralize";
import { snakeCase } from "snake-case";
import {
  IRelation,
  IMethodBaseConfig,
  IMethodBaseValidations,
  IHandlerBaseMiddleware,
  IHandlerBasedTransactionConfig,
  IQueryLimitConfig,
} from "./Interfaces";
import { Relationships, HandlerTypes, HttpMethods } from "./Enums";
import { DEFAULT_HANDLERS } from "./constants";
import {
  FieldList,
  ModelMiddlewareDefinition,
  StepTypes,
  ModelValidation,
} from "./Types";

class Model {
  get primaryKey(): string {
    return "id";
  }

  get table(): string {
    return pluralize(snakeCase(this.constructor.name));
  }

  get fillable(): FieldList | IMethodBaseConfig {
    return [];
  }

  get validations(): IMethodBaseValidations | ModelValidation {
    return {};
  }

  get handlers(): HandlerTypes[] {
    return [...DEFAULT_HANDLERS];
  }

  get middlewares(): ModelMiddlewareDefinition {
    return [];
  }

  get hiddens(): FieldList {
    return [];
  }

  get createdAtColumn(): string | null {
    return "created_at";
  }

  get updatedAtColumn(): string | null {
    return "updated_at";
  }

  get deletedAtColumn(): string | null {
    return null;
  }

  get transaction():
    | boolean
    | IHandlerBasedTransactionConfig
    | IHandlerBasedTransactionConfig[]
    | null {
    return null;
  }

  get ignore(): boolean {
    return false;
  }

  get limits(): Array<IQueryLimitConfig[]> {
    return [];
  }

  getFillableFields(methodType: HttpMethods): string[] {
    if (this.fillable === null) {
      return [];
    }

    if (Array.isArray(this.fillable)) {
      return this.fillable;
    }

    const values: IMethodBaseConfig = this.fillable;
    switch (methodType) {
      case HttpMethods.PATCH:
        return values.PATCH ?? [];
      case HttpMethods.POST:
        return values.POST ?? [];
      case HttpMethods.PUT:
        return values.PUT ?? [];
      default:
        return [];
    }
  }

  getValidationRules(methodType: HttpMethods): ModelValidation | null {
    if (this.hasStringValue()) {
      return this.validations as ModelValidation;
    }

    const values: IMethodBaseValidations = this.validations;

    switch (methodType) {
      case HttpMethods.POST:
        return values.POST ?? null;
      case HttpMethods.PATCH:
      case HttpMethods.PUT:
        return values.PUT ?? null;
      default:
        return null;
    }
  }

  getMiddlewares(handlerType: HandlerTypes): StepTypes[] {
    const results: StepTypes[] = [];
    const middlewares = this.middlewares;

    if (Array.isArray(middlewares)) {
      (middlewares as Array<any>).forEach((item) => {
        if (item?.handler) {
          const methodBasedMiddlewares = item as IHandlerBaseMiddleware;
          if (methodBasedMiddlewares.handler.includes(handlerType)) {
            results.push(methodBasedMiddlewares.middleware);
          }
        } else {
          results.push(item);
        }
      });
    } else {
      const methodBasedMiddlewares = middlewares as IHandlerBaseMiddleware;
      if (methodBasedMiddlewares.handler.includes(handlerType)) {
        results.push(methodBasedMiddlewares.middleware);
      }
    }

    return results;
  }

  hasMany(relatedModel: string, primaryKey = "id", foreignKey = ""): IRelation {
    if (!foreignKey) {
      const currentModelName = pluralize.singular(
        this.constructor.name.toLowerCase()
      );
      foreignKey = `${currentModelName}_id`;
    }
    return {
      name: relatedModel,
      type: Relationships.HAS_MANY,
      model: relatedModel,
      primaryKey,
      foreignKey,
    };
  }

  hasOne(relatedModel: string, primaryKey = "id", foreignKey = ""): IRelation {
    if (foreignKey === "") {
      foreignKey = `${pluralize.singular(relatedModel.toLowerCase())}_id`;
    }

    return {
      name: relatedModel,
      type: Relationships.HAS_ONE,
      model: relatedModel,
      primaryKey,
      foreignKey,
    };
  }

  belongsTo(relatedModel: string, primaryKey: string, foreignKey: string) {
    return this.hasOne(relatedModel, foreignKey, primaryKey);
  }

  private hasStringValue() {
    const tester: Record<string, any> = this.validations;
    let status = false;

    for (const key of Object.keys(tester)) {
      if (typeof tester[key] === "string") {
        status = true;
      }
    }

    return status;
  }
}

export default Model;
