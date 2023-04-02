import pluralize from "pluralize";
import path from "path";
import { Knex } from "knex";
import { paramCase, camelCase } from "change-case";
import { GeneralHookResolver, TransactionResolver } from "../Resolvers";
import {
  IFramework,
  IGeneralHooks,
  IModelService,
  IRelation,
  IHttpContext,
  IResponse,
  IVersion,
  IRequest,
} from "../Interfaces";
import { API_ROUTE_TEMPLATES } from "../constants";
import {
  HandlerTypes,
  Relationships,
  HttpMethods,
  StatusCodes,
} from "../Enums";
import HandlerFactory from "../Handlers/HandlerFactory";
import ApiError from "../Exceptions/ApiError";
import {
  LogService,
  DocumentationService,
  IoCService,
  APIService,
} from "../Services";
import { acceptLanguageMiddleware } from "../Middlewares";
import RequestFactory from "../Frameworks/Requests/RequestFactory";
import ResponseFactory from "../Frameworks/Response/ResponseFactory";

class RouterBuilder {
  private version: IVersion;

  constructor(version: IVersion) {
    this.version = version;
  }

  async build() {
    const app = await IoCService.useByType<IFramework>("App");
    const logger = LogService.getInstance();
    const generalHooks: IGeneralHooks = await new GeneralHookResolver(
      this.version
    ).resolve();

    if (generalHooks.onBeforeInit) {
      generalHooks.onBeforeInit(app.getFramework());
    }

    await this.createRoutesByModelTree();

    logger.info(`[${this.version.name}] ${app.name} routes have been created.`);

    if (generalHooks.onAfterInit) {
      generalHooks.onAfterInit(app.getFramework());
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
        path.join(await this.getRootPrefix(), this.version.name),
        urlPrefix,
        resource,
        model.instance.primaryKey
      );

      // Creating the middleware list for the route. As default, we support some
      // internal middlewares such as `Accept Language Middleware` which parse
      // the "accept-language" header to use in the application general.
      const middlewares = [
        (req: any, res: any, next: any) =>
          acceptLanguageMiddleware(
            RequestFactory.get(req),
            ResponseFactory.get(res),
            next
          ),
        ...model.instance.getMiddlewares(handlerType),
      ];

      // Adding the route to the API
      await this.addApiRoute(
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
      await this.createRouteByModel(
        model,
        `${urlPrefix}${resource}/:${camelCase(relation.foreignKey)}/`,
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
        await this.createRouteByModel(
          child,
          `${urlPrefix}${resource}/:${camelCase(relation.foreignKey)}/`,
          model,
          relation
        );
      }
    }
  }

  private async addApiRoute(
    handlerType: HandlerTypes,
    url: string,
    middlewares: ((req: any, res: any, next: any) => void)[],
    model: IModelService,
    parentModel: IModelService | null,
    relation: IRelation | null
  ) {
    const docs = DocumentationService.getInstance();
    const app = await IoCService.useByType<IFramework>("App");

    const handler = (req: any, res: any) => {
      this.requestHandler(
        handlerType,
        RequestFactory.get(req),
        ResponseFactory.get(res),
        model,
        parentModel,
        relation
      );
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
    req: IRequest,
    res: IResponse,
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
      const pack: IHttpContext = {
        api,
        version: this.version,
        req,
        res: res as IResponse,
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

  private sendErrorAsResponse(res: IResponse, error: any) {
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
    const api = APIService.getInstance();
    let prefix = api.config.prefix || "api";

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
