import pluralize from "pluralize";
import { paramCase, camelCase } from "change-case";
import { GeneralHookResolver } from "../Resolvers";
import {
  IGeneralHooks,
  IModelService,
  IRelation,
  IRouteData,
  IRouteParentPair,
  IVersion,
} from "../Interfaces";
import { API_ROUTE_TEMPLATES, HANDLER_METHOD_MAP } from "../constants";
import { HandlerTypes, Relationships } from "../Enums";
import {
  LogService,
  DocumentationService,
  IoCService,
  APIService,
} from "../Services";
import URLService from "../Services/URLService";
import { AxeFunction } from "src/Types";
import App from "../Services/App";

class RouterBuilder {
  private version: IVersion;

  constructor(version: IVersion) {
    this.version = version;
  }

  async build() {
    const app = await IoCService.use<App>("App");
    const generalHooks: IGeneralHooks = await new GeneralHookResolver(
      this.version,
    ).resolve();

    if (generalHooks.onBeforeInit) {
      generalHooks.onBeforeInit(app);
    }

    await this.createRoutesByModelTree();

    LogService.debug(`[${this.version.name}] All endpoints have been created.`);

    if (generalHooks.onAfterInit) {
      generalHooks.onAfterInit(app);
    }
  }

  private async createRoutesByModelTree() {
    for (const model of this.version.modelTree) {
      await this.createRouteByModel(model, []);
    }
  }

  private async createRouteByModel(
    model: IModelService,
    parentPairs: IRouteParentPair[] = [],
    urlPrefix = "",
    parentModel: IModelService | null = null,
    relation: IRelation | null = null,
    allowRecursive = true,
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
        model.instance.primaryKey,
      );

      // Creating the middleware list for the route. As default, we support some
      // internal middlewares such as `Accept Language Middleware` which parse
      // the "accept-language" header to use in the application general.
      const middlewares: AxeFunction[] = [
        ...model.instance.getMiddlewares(handlerType),
      ];

      // Adding the endpoint
      await this.addRoute(
        handlerType,
        url,
        middlewares,
        model,
        parentPairs,
        parentModel,
        relation,
      );
    }

    await this.createChildRoutes(model, resource, urlPrefix, parentPairs);
    await this.createNestedRoutes(model, allowRecursive, urlPrefix, resource);
  }

  private async createNestedRoutes(
    model: IModelService,
    allowRecursive: boolean,
    urlPrefix: string,
    resource: string,
  ) {
    if (!model.isRecursive || !allowRecursive) {
      return;
    }

    // We should different parameter name for child routes
    const relation = model.relations.find(
      (relation) =>
        relation.model === model.name &&
        relation.type === Relationships.HAS_MANY,
    );

    if (relation) {
      const paramName = camelCase(`${model.name}-${relation.primaryKey}`);
      const parentPair: IRouteParentPair = {
        model,
        paramName,
      };
      await this.createRouteByModel(
        model,
        [parentPair],
        `${urlPrefix}${resource}/:${paramName}/`,
        model,
        relation,
        false,
      );
    }
  }

  private async createChildRoutes(
    model: IModelService,
    resource: string,
    urlPrefix: string,
    parentPairs: IRouteParentPair[],
  ) {
    if (model.children.length === 0) {
      return;
    }

    // We should different parameter name for child routes
    const subRelations = model.relations.filter(
      (item) =>
        item.type === Relationships.HAS_MANY && item.options.autoRouting,
    );
    for (const relation of subRelations) {
      const child = model.children.find((item) => item.name === relation.model);
      // It should be recursive
      if (child) {
        const paramName = camelCase(`${model.name}-${relation.primaryKey}`);
        // Setting the new parent pair depth
        const parentPair: IRouteParentPair = {
          model,
          paramName,
        };
        await this.createRouteByModel(
          child,
          [...parentPairs, parentPair],
          `${urlPrefix}${resource}/:${paramName}/`,
          model,
          relation,
        );
      }
    }
  }

  private async addRoute(
    handlerType: HandlerTypes,
    url: string,
    middlewares: AxeFunction[],
    model: IModelService,
    parentPairs: IRouteParentPair[],
    parentModel: IModelService | null,
    relation: IRelation | null,
  ) {
    const docs = DocumentationService.getInstance();

    const data: IRouteData = {
      version: this.version,
      handlerType,
      model,
      parentModel,
      relation,
    };

    // Adding the route
    await URLService.add(
      HANDLER_METHOD_MAP[handlerType],
      url,
      data,
      middlewares,
      parentPairs,
    );

    // Documentation
    docs.push(
      this.version,
      handlerType,
      HANDLER_METHOD_MAP[handlerType],
      url,
      model,
      parentModel,
    );
  }

  private getResourcePath(model: IModelService, relation: IRelation | null) {
    return relation
      ? paramCase(relation.name)
      : paramCase(pluralize.plural(model.name)).toLowerCase();
  }

  private getRootPrefix = async (): Promise<string> => {
    const api = APIService.getInstance();
    let prefix = api.config.prefix;

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
