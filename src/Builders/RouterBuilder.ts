import pluralize from "pluralize";
import { Knex } from "knex";
import { Express, Request, Response, NextFunction } from "express";
import { paramCase, camelCase } from "change-case";
import { GeneralHookResolver, TransactionResolver } from "../Resolvers";
import {
  IGeneralHooks,
  IModelService,
  IRelation,
  IRequestPack,
  IVersion,
} from "../Interfaces";
import { API_ROUTE_TEMPLATES } from "../constants";
import { HandlerTypes, Relationships, HttpMethods } from "../Enums";
import HandlerFactory from "../Handlers/HandlerFactory";
import ApiError from "../Exceptions/ApiError";
import {
  LogService,
  DocumentationService,
  IoCService,
  APIService,
} from "../Services";
import { acceptLanguageMiddleware } from "../Middlewares";

class RouterBuilder {
  private version: IVersion;

  constructor(version: IVersion) {
    this.version = version;
  }

  async build() {
    const app = await IoCService.useByType<Express>("App");
    const logger = LogService.getInstance();
    const generalHooks: IGeneralHooks = await new GeneralHookResolver(
      this.version
    ).resolve();

    if (generalHooks.onBeforeInit) {
      generalHooks.onBeforeInit(app);
    }

    await this.createRoutesByModelTree();

    logger.info(`[${this.version.name}] Express routes have been created.`);

    if (generalHooks.onAfterInit) {
      generalHooks.onAfterInit(app);
    }
  }

  private async createRoutesByModelTree() {
    for (const model of this.version.modelTree) {
      await this.createRouteByModel(model);
    }
  }

  private async createRouteByModel(
    model: IModelService,
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
        `${await this.getRootPrefix()}/${this.version.name}`,
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

    await this.createChildRoutes(model, resource, urlPrefix);
    await this.createNestedRoutes(model, allowRecursive, urlPrefix, resource);
  }

  private async createNestedRoutes(
    model: IModelService,
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
      const paramName = camelCase(`${model.name}-${relation.primaryKey}`);
      await this.createRouteByModel(
        model,
        `${urlPrefix}${resource}/:${paramName}/`,
        model,
        relation,
        false
      );
    }
  }

  private async createChildRoutes(
    model: IModelService,
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
        const paramName = camelCase(`${model.name}-${relation.primaryKey}`);
        await this.createRouteByModel(
          child,
          `${urlPrefix}${resource}/:${paramName}/`,
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
    const docs = DocumentationService.getInstance();
    const app = await IoCService.useByType<Express>("App");

    const handler = async (req: Request, res: Response, next: NextFunction) => {
      try {
        await this.requestHandler(
          handlerType,
          req,
          res,
          model,
          parentModel,
          relation
        );
      } catch (error: any) {
        // Catch error then pass it to the express error handler
        next(error);
      }
    };

    switch (handlerType) {
      case HandlerTypes.ALL:
        app.get(url, middlewares, handler);
        docs.push(this.version, HandlerTypes.ALL, HttpMethods.GET, url, model);
        break;
      case HandlerTypes.DELETE:
        app.delete(url, middlewares, handler);
        docs.push(
          this.version,
          HandlerTypes.DELETE,
          HttpMethods.DELETE,
          url,
          model
        );
        break;
      case HandlerTypes.FORCE_DELETE:
        app.delete(url, middlewares, handler);
        docs.push(
          this.version,
          HandlerTypes.FORCE_DELETE,
          HttpMethods.DELETE,
          url,
          model
        );
        break;
      case HandlerTypes.INSERT:
        app.post(url, middlewares, handler);
        docs.push(
          this.version,
          HandlerTypes.INSERT,
          HttpMethods.POST,
          url,
          model
        );
        break;
      case HandlerTypes.PAGINATE:
        app.get(url, middlewares, handler);
        docs.push(
          this.version,
          HandlerTypes.PAGINATE,
          HttpMethods.GET,
          url,
          model
        );
        break;
      case HandlerTypes.PATCH:
        app.patch(url, middlewares, handler);
        docs.push(
          this.version,
          HandlerTypes.PATCH,
          HttpMethods.PATCH,
          url,
          model
        );
        break;
      case HandlerTypes.SHOW:
        app.get(url, middlewares, handler);
        docs.push(this.version, HandlerTypes.SHOW, HttpMethods.GET, url, model);
        break;
      case HandlerTypes.UPDATE:
        app.put(url, middlewares, handler);
        docs.push(
          this.version,
          HandlerTypes.UPDATE,
          HttpMethods.PUT,
          url,
          model
        );
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
      const database = (await IoCService.use("Database")) as Knex;
      const api = APIService.getInstance();

      hasTransaction = await new TransactionResolver(this.version).resolve(
        model,
        handlerType
      );
      if (hasTransaction) {
        trx = await database.transaction();
      }

      const handler = HandlerFactory.get(handlerType);
      const pack: IRequestPack = {
        api,
        version: this.version,
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

    if (type === "ApiError") {
      // eslint-disable-next-line no-case-declarations
      const apiError: ApiError = error as ApiError;
      res.status(apiError.status).json({
        error: apiError.message,
      });
      return;
    }

    // We should log error and send general error response
    LogService.getInstance().error(
      `SERVER ERROR: ${JSON.stringify(
        { ...error, message: error.message },
        null,
        "  "
      )}`
    );
    throw error;
  }

  private getResourcePath(model: IModelService, relation: IRelation | null) {
    return relation
      ? paramCase(relation.name)
      : paramCase(pluralize.plural(model.name)).toLowerCase();
  }

  private getRootPrefix = async (): Promise<string> => {
    const api = APIService.getInstance();
    let prefix = api.config.prefix || "api";

    if (prefix.startsWith("/")) {
      prefix = prefix.substring(1);
    }

    if (prefix.endsWith("/")) {
      prefix = prefix.substring(0, prefix.length - 1);
    }

    return prefix;
  };
}

export default RouterBuilder;
