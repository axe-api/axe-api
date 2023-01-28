import pluralize from "pluralize";
import { StatusCodes } from "http-status-codes";
import { Knex } from "knex";
import { Express, Request, Response, NextFunction } from "express";
import { paramCase, camelCase } from "change-case";
import { GeneralHookResolver, TransactionResolver } from "../Resolvers";
import {
  IGeneralHooks,
  IModelService,
  IRelation,
  IRequestPack,
} from "../Interfaces";
import { API_ROUTE_TEMPLATES } from "../constants";
import { HandlerTypes, Relationships, HttpMethods } from "../Enums";
import HandlerFactory from "../Handlers/HandlerFactory";
import ApiError from "../Exceptions/ApiError";
import {
  LogService,
  DocumentationService,
  IoCService,
  ModelListService,
} from "../Services";
import { acceptLanguageMiddleware } from "../Middlewares";

class RouterBuilder {
  async build() {
    const app = await IoCService.useByType<Express>("App");
    const logger = await IoCService.useByType<LogService>("LogService");
    const modelTree = await IoCService.useByType<IModelService[]>("ModelTree");
    const modelList = await IoCService.useByType<ModelListService>(
      "ModelListService"
    );
    const generalHooks: IGeneralHooks = await GeneralHookResolver.resolve();

    if (generalHooks.onBeforeInit) {
      generalHooks.onBeforeInit(app);
    }

    await this.createRoutesByModelTree(modelTree, modelList);

    logger.info("Express routes have been created.");

    if (generalHooks.onAfterInit) {
      generalHooks.onAfterInit(app);
    }
  }

  private async createRoutesByModelTree(
    modelTree: IModelService[],
    modelList: ModelListService
  ) {
    for (const model of modelTree) {
      await this.createRouteByModel(model, modelList);
    }
  }

  private async createRouteByModel(
    model: IModelService,
    modelList: ModelListService,
    urlPrefix = "",
    parentModel: IModelService | null = null,
    relation: IRelation | null = null,
    allowRecursive = true
  ) {
    if (model.instance.ignore) {
      return;
    }

    const resource = this.getResourcePath(model, relation);
    // We create and handle routes by not duplicate so many lines.
    for (const handler of Object.keys(API_ROUTE_TEMPLATES)) {
      const handlerType: HandlerTypes = <HandlerTypes>handler;
      if (!model.instance.handlers.includes(handlerType)) {
        continue;
      }

      const urlCreator = API_ROUTE_TEMPLATES[handlerType];
      const url = urlCreator(
        await this.getRootPrefix(),
        urlPrefix,
        resource,
        model.instance.primaryKey
      );

      // Creating the middleware list for the route. As default, we support some
      // internal middlewares such as `Accept Language Middleware` which parse
      // the "accept-language" header to use in the application general.
      const middlewares = [
        acceptLanguageMiddleware,
        ...model.instance.getMiddlewares(handlerType),
      ];

      // Adding the route to the express
      await this.addExpressRoute(
        handlerType,
        url,
        middlewares,
        model,
        parentModel,
        relation
      );
    }

    await this.createChildRoutes(model, modelList, resource, urlPrefix);
    await this.createNestedRoutes(
      model,
      modelList,
      allowRecursive,
      urlPrefix,
      resource
    );
  }

  private async createNestedRoutes(
    model: IModelService,
    modelList: ModelListService,
    allowRecursive: boolean,
    urlPrefix: string,
    resource: string
  ) {
    if (!model.isRecursive || !allowRecursive) {
      return;
    }

    // We should different parameter name for child routes
    const relation = model.relations.find(
      (relation) =>
        relation.model === model.name &&
        relation.type === Relationships.HAS_MANY
    );

    if (relation) {
      await this.createRouteByModel(
        model,
        modelList,
        `${urlPrefix}${resource}/:${camelCase(relation.foreignKey)}/`,
        model,
        relation,
        false
      );
    }
  }

  private async createChildRoutes(
    model: IModelService,
    modelList: ModelListService,
    resource: string,
    urlPrefix: string
  ) {
    if (model.children.length === 0) {
      return;
    }

    // We should different parameter name for child routes
    const subRelations = model.relations.filter(
      (item) => item.type === Relationships.HAS_MANY
    );
    for (const relation of subRelations) {
      const child = model.children.find((item) => item.name === relation.model);
      // It should be recursive
      if (child) {
        await this.createRouteByModel(
          child,
          modelList,
          `${urlPrefix}${resource}/:${camelCase(relation.foreignKey)}/`,
          model,
          relation
        );
      }
    }
  }

  private getPrimaryKeyName = (model: IModelService): string => {
    return (
      pluralize.singular(model.name).toLowerCase() +
      this.ucFirst(model.instance.primaryKey)
    );
  };

  private ucFirst = (value: string): string => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  private async addExpressRoute(
    handlerType: HandlerTypes,
    url: string,
    middlewares: ((req: Request, res: Response, next: NextFunction) => void)[],
    model: IModelService,
    parentModel: IModelService | null,
    relation: IRelation | null
  ) {
    const docs = await IoCService.useByType<DocumentationService>(
      "DocumentationService"
    );
    const app = await IoCService.useByType<Express>("App");
    const handler = (req: Request, res: Response) => {
      this.requestHandler(handlerType, req, res, model, parentModel, relation);
    };

    switch (handlerType) {
      case HandlerTypes.ALL:
        app.get(url, middlewares, handler);
        docs.push(HttpMethods.GET, url, model);
        break;
      case HandlerTypes.DELETE:
        app.delete(url, middlewares, handler);
        docs.push(HttpMethods.DELETE, url, model);
        break;
      case HandlerTypes.FORCE_DELETE:
        app.delete(url, middlewares, handler);
        docs.push(HttpMethods.DELETE, url, model);
        break;
      case HandlerTypes.INSERT:
        app.post(url, middlewares, handler);
        docs.push(HttpMethods.POST, url, model);
        break;
      case HandlerTypes.PAGINATE:
        app.get(url, middlewares, handler);
        docs.push(HttpMethods.GET, url, model);
        break;
      case HandlerTypes.PATCH:
        app.patch(url, middlewares, handler);
        docs.push(HttpMethods.PATCH, url, model);
        break;
      case HandlerTypes.SHOW:
        app.get(url, middlewares, handler);
        docs.push(HttpMethods.GET, url, model);
        break;
      case HandlerTypes.UPDATE:
        app.put(url, middlewares, handler);
        docs.push(HttpMethods.PUT, url, model);
        break;
      default:
        throw new Error("Undefined handler type");
    }
  }

  private async requestHandler(
    handlerType: HandlerTypes,
    req: Request,
    res: Response,
    model: IModelService,
    parentModel: IModelService | null,
    relation: IRelation | null
  ) {
    let trx: Knex.Transaction | null = null;
    let hasTransaction = false;

    try {
      const factory = await IoCService.useByType<HandlerFactory>(
        "HandlerFactory"
      );
      const database = (await IoCService.use("Database")) as Knex;

      hasTransaction = await TransactionResolver.resolve(model, handlerType);
      if (hasTransaction) {
        trx = await database.transaction();
      }

      const handler = factory.get(handlerType);
      const pack: IRequestPack = {
        req,
        res,
        handlerType,
        model,
        parentModel,
        relation,
        database: hasTransaction && trx ? trx : database,
      };
      await handler(pack);

      if (hasTransaction && trx) {
        trx.commit();
      }
    } catch (error: any) {
      if (hasTransaction && trx) {
        trx.rollback();
      }

      this.sendErrorAsResponse(res, error);
    }
  }

  private sendErrorAsResponse(res: Response, error: any) {
    const type: string | undefined = error.type;

    switch (type) {
      case "ApiError":
        // eslint-disable-next-line no-case-declarations
        const apiError: ApiError = error as ApiError;
        res.status(apiError.status).json({
          error: apiError.message,
        });
        break;

      default:
        // We should not show the real errors on production
        if (process.env.NODE_ENV === "production") {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "An error occurredxx.",
          });
        }

        throw error;
    }
  }

  private getResourcePath(model: IModelService, relation: IRelation | null) {
    return relation
      ? paramCase(relation.name)
      : paramCase(pluralize.plural(model.name)).toLowerCase();
  }

  private getRootPrefix = async (): Promise<string> => {
    const config = await IoCService.use("Config");
    let prefix = config?.Application?.prefix || "api";

    if (prefix.substr(0, 1) === "/") {
      prefix = prefix.substr(1);
    }

    if (prefix.substr(prefix.length - 1) === "/") {
      prefix = prefix.substr(0, prefix.length - 1);
    }

    return prefix;
  };
}

export default RouterBuilder;
