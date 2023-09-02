import pluralize from "pluralize";
import { snakeCase } from "snake-case";
import {
  IRelation,
  IMethodBaseConfig,
  IQueryLimitConfig,
  IHandlerBaseMiddleware,
  IHandlerBasedTransactionConfig,
} from "./Interfaces";
import { Relationships, HandlerTypes, HttpMethods } from "./Enums";
import { DEFAULT_HANDLERS } from "./constants";
import { ModelMiddleware, AxeFunction, ModelValidation } from "./Types";

class Model {
  /**
   * The primary key of the model. By default, it is `id`. But you can choose
   * another name like `uuid`.
   *
   * @example
   *  get primaryKey() {
   *    return "id"
   *  }
   * @type {string}
   * @tutorial https://axe-api.com/reference/model-primary-key.html
   */
  get primaryKey(): string {
    return "id";
  }

  /**
   * The database table name of the model. By default, Axe API uses the plural
   * version of the model(`User.ts` => `users`) name. You can specify a custom
   * name like `my_users`.
   *
   * @example
   *  get table() {
   *    return "my_users_table"
   *  }
   * @type {string}
   * @tutorial https://axe-api.com/reference/model-table.html
   */
  get table(): string {
    return pluralize(snakeCase(this.constructor.name));
  }

  /**
   * By this method, you can define which fields can be filled by the HTTP client.
   * If you do not define, the HTTP client can not fill any field.
   *
   * @example
   *  get fillable() {
   *    return ["name", "email", "password"]
   *  }
   * @type {(string[] | IMethodBaseConfig)}
   * @tutorial https://axe-api.com/reference/model-fillable.html
   */
  get fillable(): string[] | IMethodBaseConfig<string[]> {
    return [];
  }

  /**
   * You can define the validation rules of the model. Method-based validations
   * are also acceptable.
   *
   * @example
   *  get validations() {
   *    return {
   *      "name": "required|min:1|max:100",
   *      "email": "required|email",
   *    }
   *  }
   * @type {(ModelValidation | IMethodBaseConfig<ModelValidation>)}
   * @tutorial https://axe-api.com/reference/model-validations.html
   */
  get validations(): ModelValidation | IMethodBaseConfig<ModelValidation> {
    return {};
  }

  /**
   * You can define acceptable handlers here.
   *
   * The default value is `DEFAULT_HANDLERS`
   *
   * @example
   *  get handlers() {
   *    return [HandlerTypes.PAGINATE]
   *  }
   * @type {HandlerTypes[]}
   * @tutorial https://axe-api.com/reference/model-handlers.html
   */
  get handlers(): HandlerTypes[] {
    return [...DEFAULT_HANDLERS];
  }

  /**
   * You can define a special handler for the model here. `MiddlewareFunction`,
   * `HandlerFunction`, and `PhaseFunction` are acceptable middlewares.
   *
   * Also, you can define handler-based middlewares.
   *
   * @example
   *  get middlewares() {
   *    return [
   *      {
   *        handler: [HandlerTypes.DELETE],
   *        middleware: isAdminMiddleware,
   *      }
   *    ]
   *  }
   * @type {ModelMiddleware}
   * @tutorial https://axe-api.com/reference/model-middlewares.html
   */
  get middlewares(): ModelMiddleware {
    return [];
  }

  /**
   * You can define which fields will be hiding in HTTP responses. The selected
   * fields will not be listed in any response.
   *
   * You should mark as hidden sensitive data fields such as `password`, `token`, etc.
   *
   * @example
   *  get hiddens() {
   *    return ["password_salt", "password_hash", "github_token"]
   *  }
   * @type {string[]}
   * @tutorial https://axe-api.com/reference/model-hiddens.html
   */
  get hiddens(): string[] {
    return [];
  }

  /**
   * The `created_at` column name is in the database table. The default value is
   * `created_at`. You can specify with a custom field name.
   *
   * It should be null if the table doesn't have a `created_at` column.
   *
   * @example
   *  get createdAtColumn() {
   *    return "created_at"
   *  }
   * @type {(string | null)}
   * @tutorial https://axe-api.com/reference/model-created-at-column.html
   */
  get createdAtColumn(): string | null {
    return "created_at";
  }

  /**
   * The `updated_at` column name is in the database table. The default value is
   * `updated_at`. You can specify with a custom field name.
   *
   * It should be null if the table doesn't have a `updated_at` column.
   *
   * @example
   *  get updatedAtColumn() {
   *    return "updated_at"
   *  }
   * @type {(string | null)}
   * @tutorial https://axe-api.com/reference/model-updated-at-column.html
   */
  get updatedAtColumn(): string | null {
    return "updated_at";
  }

  /**
   * The `deleted_at` column name is in the database table. The default value is
   * `null`. You can specify with a custom field name.
   *
   * If you provide a name, that means your model supports the soft delete feature.
   *
   * @example
   *  get deletedAtColumn() {
   *    return "deleted_at"
   *  }
   * @type {(string | null)}
   * @tutorial https://axe-api.com/reference/model-deleted-at-column.html
   */
  get deletedAtColumn(): string | null {
    return null;
  }

  /**
   * The transaction configuration on the model. The database transaction can
   * be started for all endpoints on the model as well as handler-based.
   *
   * Creating, rollbacking, and committing a transaction is managed by Axe API.
   *
   * @example
   *  get transaction() {
   *    return [
   *      {
   *        handlers: [HandlerTypes.INSERT],
   *        transaction: true
   *      }
   *    ]
   *  }
   * @type {(boolean | IHandlerBasedTransactionConfig[])}
   * @tutorial https://axe-api.com/learn/database-transactions.html#model-based-transactions
   */
  get transaction(): boolean | IHandlerBasedTransactionConfig[] {
    return false;
  }

  /**
   * You can completely ignore the model. Axe API doesn't create the routes
   * automatically.
   *
   * @example
   *  get ignore() {
   *    return true
   *  }
   * @type {boolean}
   * @tutorial https://axe-api.com/reference/model-ignore.html
   */
  get ignore(): boolean {
    return false;
  }

  /**
   * You can limit query features such as `select.*` or `LIKE`, etc.
   *
   * @example
   *  get limits() {
   *    return [
   *      allow(QueryFeature.WhereLike),
   *      deny(QueryFeature.FieldsAll)
   *    ];
   * }
   * @type {Array<IQueryLimitConfig[]>}
   * @tutorial https://axe-api.com/reference/model-limits.html
   */
  get limits(): Array<IQueryLimitConfig[]> {
    return [];
  }

  /**
   * Model relationship definition. Axe API creates `hasMany` routes automatically.
   *
   * @example
   *  get relationName() {
   *    return this.hasMany("Post", "id", "user_id")
   * }
   * @type {Array<IQueryLimitConfig[]>}
   * @tutorial https://axe-api.com/learn/routing.html#model-relations
   */
  hasMany(relatedModel: string, primaryKey = "id", foreignKey = ""): IRelation {
    if (!foreignKey) {
      const currentModelName = pluralize.singular(
        this.constructor.name.toLowerCase(),
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

  /**
   * Model relationship definition.
   *
   * @example
   *  get relationName() {
   *    return this.hasOne("User", "id", "user_id")
   * }
   * @type {Array<IQueryLimitConfig[]>}
   * @tutorial https://axe-api.com/learn/routing.html#model-relations
   */
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

  /**
   * Model relationship definition.
   *
   * @example
   *  get relationName() {
   *    return this.belongsTo("User", "user_id", "id")
   * }
   * @type {Array<IQueryLimitConfig[]>}
   * @tutorial https://axe-api.com/learn/routing.html#model-relations
   */
  belongsTo(relatedModel: string, primaryKey: string, foreignKey: string) {
    return this.hasOne(relatedModel, foreignKey, primaryKey);
  }

  getFillableFields(methodType: HttpMethods): string[] {
    if (this.fillable === null) {
      return [];
    }

    if (Array.isArray(this.fillable)) {
      return this.fillable;
    }

    const values: IMethodBaseConfig<string[]> = this.fillable;
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

    const values: IMethodBaseConfig<ModelValidation> = this.validations;

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

  getMiddlewares(handlerType: HandlerTypes): AxeFunction[] {
    const results: AxeFunction[] = [];
    const middlewares = this.middlewares;

    if (Array.isArray(middlewares)) {
      (middlewares as Array<any>).forEach((item) => {
        if (item?.handler) {
          const handlerBasedMiddlewares = item as IHandlerBaseMiddleware;
          if (handlerBasedMiddlewares.handler.includes(handlerType)) {
            results.push(handlerBasedMiddlewares.middleware);
          }
        } else {
          results.push(item);
        }
      });
    } else {
      const handlerBasedMiddlewares = middlewares as IHandlerBaseMiddleware;
      if (handlerBasedMiddlewares.handler.includes(handlerType)) {
        results.push(handlerBasedMiddlewares.middleware);
      }
    }

    return results;
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
