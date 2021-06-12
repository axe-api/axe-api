import IoC from "./../core/IoC.js";
import pluralize from "pluralize";
import { RELATIONSHIPS, API_ROUTE_TEMPLATES } from "./../constants.js";
import Handlers from "./../handlers/index.js";

let Config = null;

const handleErrors = (req, res, error) => {
  const status = error.type === "HttpResponse" ? error.status : 400;
  let errors = error.content ? error.content : error.message;

  if (Config.Application.env === "production") {
    errors = "An error occurred!";
  }

  const result = {
    errors,
  };

  if (Config.Application.env === "development") {
    result.stack = error.stack;
  }

  res.status(status).json(result);
};

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

const requestHandler = async (handler, req, res, context) => {
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

    handleErrors(req, res, error);
  }
};

const ucFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getResourcePath = (model, relation) => {
  return relation
    ? relation.resource
    : pluralize.plural(model.name).toLowerCase();
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
  
  if (model.instance.ignore) {
    return;
  }

  await createRouteByModel(
    model,
    models,
    `${urlPrefix}${resource}/:${getPrimaryKeyName(model)}/`,
    model,
    relation,
    false
  );
};

const getModelMiddlewares = (model, handler) => {
  const middlewares = [];
  if (model.instance.middlewares.length > 0) {
    const filtered = model.instance.middlewares
      .filter((item) => typeof item === "function" || item.handler === handler)
      .map((item) => {
        if (typeof item === "function") {
          return item;
        }
        return item.middleware;
      });
    middlewares.push(...filtered);
  }
  return middlewares;
};

const createRouteByModel = async (
  model,
  models,
  urlPrefix = "",
  parentModel = null,
  relation = null,
  allowRecursive = true
) => {
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
    app[routeTemplate.method.toLowerCase()](url, middlewares, (req, res) => {
      requestHandler(handler, req, res, context);
    });
  }

  await createChildRoutes(model, models, resource, urlPrefix);
  await createNestedRoutes(model, models, allowRecursive, urlPrefix, resource);
};

const callAppInit = async (appDirectory, app) => {
  const fs = await IoC.use("fs");
  const path = await IoC.use("path");
  const url = await IoC.use("url");

  // Calling the user's custom definitions
  const customInitFile = path.join(appDirectory, `init.js`);
  if (fs.existsSync(customInitFile)) {
    const { default: initter } = await import(
      url.pathToFileURL(customInitFile).href
    );
    await initter({ app });
  }
};

const createRoutesByModelTree = async (modelTree, models) => {
  for (const model of modelTree) {
    await createRouteByModel(model, models);
  }
};

export default async (app, modelTree, appDirectory, models) => {
  Config = await IoC.use("Config");
  const logger = await IoC.use("Logger");

  await createRoutesByModelTree(modelTree, models);
  await callAppInit(appDirectory, app);

  logger.info("All routes have been created.");
};
