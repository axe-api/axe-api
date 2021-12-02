import IoC from "./../core/IoC.js";
import pluralize from "pluralize";
import { paramCase, camelCase } from "change-case";
import { RELATIONSHIPS, API_ROUTE_TEMPLATES } from "./../constants.js";
import Handlers from "./../handlers/index.js";

let Config = null;

const setTransactionOption = (option, handler, defaultValue) => {
  if (Array.isArray(option)) {
    if (option.some((i) => i.handler === handler)) {
      defaultValue = option.find((i) => i.handler === handler).transaction;
    }
  } else {
    defaultValue = option;
  }

  return defaultValue;
};

const hasTransaction = (config, model, handler) => {
  const global = config.Application.transaction;
  const local = model.instance.transaction;
  let privilegedOption = false;

  if (global) {
    privilegedOption = setTransactionOption(global, handler, privilegedOption);
  }

  if (local !== null) {
    privilegedOption = setTransactionOption(local, handler, privilegedOption);
  }

  return privilegedOption;
};

const requestHandler = async (handler, req, res, next, context) => {
  try {
    context.trx = context.database;
    if (hasTransaction(Config, context.model, handler)) {
      context.trx = await context.database.transaction();
    }
    await Handlers[handler]({
      ...context,
      request: req,
      response: res,
    });

    if (context.trx.commit) {
      await context.trx.commit();
    }
  } catch (error) {
    if (context.trx.rollback) {
      await context.trx.rollback();
    }

    if (error.type === "HttpResponse") {
      return res.status(error.status).json(error.content);
    }

    next(error);
  }
};

const ucFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getResourcePath = (model, relation) => {
  return relation
    ? relation.resource
    : paramCase(pluralize.plural(model.name)).toLowerCase();
};

const getPrimaryKeyName = (model) => {
  return (
    pluralize.singular(model.name).toLowerCase() +
    ucFirst(model.instance.primaryKey)
  );
};

const createChildRoutes = async (model, models, resource, urlPrefix) => {
  if (model.children.length === 0) {
    return;
  }

  // We should different parameter name for child routes
  const primaryKey = getPrimaryKeyName(model);
  const subRelations = model.instance.relations.filter(
    (item) => item.type === RELATIONSHIPS.HAS_MANY
  );
  for (const relation of subRelations) {
    const child = model.children.find((item) => item.name === relation.model);
    // It should be recursive
    await createRouteByModel(
      child,
      models,
      `${urlPrefix}${resource}/:${primaryKey}/`,
      model,
      relation
    );
  }
};

const createNestedRoutes = async (
  model,
  models,
  allowRecursive,
  urlPrefix,
  resource
) => {
  if (!model.isRecursive || !allowRecursive) {
    return;
  }

  // We should different parameter name for child routes
  const relation = model.instance.relations.find(
    (relation) =>
      relation.model === model.name && relation.type === RELATIONSHIPS.HAS_MANY
  );

  await createRouteByModel(
    model,
    models,
    `${urlPrefix}${resource}/:${camelCase(relation.foreignKey)}/`,
    model,
    relation,
    false
  );
};

const hasAMiddleware = (definition, handler) => {
  if (typeof definition === "function") {
    return true;
  }

  if (definition.handler === handler) {
    return true;
  }

  if (
    Array.isArray(definition.handler) &&
    definition.handler.includes(handler)
  ) {
    return true;
  }

  return false;
};

const getModelMiddlewares = (model, handler) => {
  const middlewares = [];
  if (model.instance.middlewares.length > 0) {
    const filtered = model.instance.middlewares
      .filter((definition) => hasAMiddleware(definition, handler))
      .map((definition) => {
        if (typeof definition === "function") {
          return definition;
        }
        return definition.middleware;
      });
    middlewares.push(...filtered);
  }
  return middlewares;
};

const getRootPrefix = () => {
  if (Config.Application.prefix) {
    return Config.Application.prefix.replace(/^\/|\/$/g, "");
  }
  return "api";
};

const createRouteByModel = async (
  model,
  models,
  urlPrefix = "",
  parentModel = null,
  relation = null,
  allowRecursive = true
) => {
  if (model.instance.ignore) {
    return;
  }

  const logger = await IoC.use("Logger");
  const app = await IoC.use("App");
  const database = await IoC.use("Database");
  const docs = await IoC.use("Docs");

  const context = {
    model,
    models,
    parentModel,
    relation,
    Config,
    database,
    logger,
  };

  const resource = getResourcePath(model, relation);

  // We create and handle routes by not duplicate so many lines.
  for (const handler of Object.keys(API_ROUTE_TEMPLATES)) {
    if (!model.instance.handlers.includes(handler)) {
      continue;
    }

    const routeTemplate = API_ROUTE_TEMPLATES[handler];
    const url = routeTemplate.url(
      getRootPrefix(),
      urlPrefix,
      resource,
      model.instance.primaryKey
    );
    logger.debug(`Model routes created: ${url}`);

    // Detecting filters
    const middlewares = getModelMiddlewares(model, handler);

    // Adding created route to the documentation
    docs.push(routeTemplate.method, url, model);

    // Adding the route to the express
    app[routeTemplate.method.toLowerCase()](
      url,
      middlewares,
      (req, res, next) => {
        requestHandler(handler, req, res, next, context);
      }
    );
  }

  await createChildRoutes(model, models, resource, urlPrefix);
  await createNestedRoutes(model, models, allowRecursive, urlPrefix, resource);
};

const getGeneralHooks = async (appDirectory) => {
  const fs = await IoC.use("fs");
  const path = await IoC.use("path");
  const url = await IoC.use("url");

  // Calling the user's custom definitions
  const customInitFile = path.join(appDirectory, `init.js`);
  if (fs.existsSync(customInitFile)) {
    const { onBeforeInit, onAfterInit } = await import(
      url.pathToFileURL(customInitFile).href
    );
    return { onBeforeInit, onAfterInit };
  }

  return { onBeforeInit: null, onAfterInit: null };
};

const createRoutesByModelTree = async (modelTree, models) => {
  for (const model of modelTree) {
    await createRouteByModel(model, models);
  }
};

export default async (app, modelTree, appDirectory, models) => {
  Config = await IoC.use("Config");
  const logger = await IoC.use("Logger");

  const { onBeforeInit, onAfterInit } = await getGeneralHooks(appDirectory);

  if (typeof onBeforeInit === "function") {
    await onBeforeInit({ app });
  }

  await createRoutesByModelTree(modelTree, models);

  if (typeof onAfterInit === "function") {
    await onAfterInit({ app });
  }

  logger.info("All routes have been created.");
};
