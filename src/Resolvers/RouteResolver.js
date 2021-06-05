import IoC from "./../core/IoC.js";
import pluralize from "pluralize";
import { RELATIONSHIPS, API_ROUTE_TEMPLATES } from "./../Constants.js";
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

const requestHandler = async (method, req, res, pack) => {
  try {
    await Handlers[method]({
      ...pack,
      request: req,
      response: res,
    });
  } catch (error) {
    handleErrors(req, res, error);
  }
};

const ucFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const _createRoutes = async (
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

  const pack = {
    model,
    models,
    parentModel,
    relation,
    Config,
    database,
    logger,
  };

  const resource = relation
    ? relation.resource
    : pluralize.plural(model.name).toLowerCase();

  // We create and handle routes by not duplicate so many lines.
  for (const handler of Object.keys(API_ROUTE_TEMPLATES)) {
    if (model.instance.handlers.includes(handler)) {
      const routeTemplate = API_ROUTE_TEMPLATES[handler];
      const url = routeTemplate.url(
        urlPrefix,
        resource,
        model.instance.primaryKey
      );
      logger.debug(`Model routes created: ${url}`);

      // Detecting filters
      const middlewares = [];
      if (model.instance.middlewares.length > 0) {
        const filtered = model.instance.middlewares
          .filter(
            (item) => typeof item === "function" || item.handler === handler
          )
          .map((item) => {
            if (typeof item === "function") {
              return item;
            }
            return item.middleware;
          });
        middlewares.push(...filtered);
      }

      // Adding created route to the documentation
      docs.push(routeTemplate.method, url, model);

      // Adding the route to the express
      app[routeTemplate.method.toLowerCase()](url, middlewares, (req, res) => {
        requestHandler(handler, req, res, pack);
      });
    }
  }

  if (model.children.length > 0) {
    // We should different parameter name for child routes
    const primaryKey =
      pluralize.singular(model.name).toLowerCase() +
      ucFirst(model.instance.primaryKey);
    const subRelations = model.instance.relations.filter(
      (item) => item.type === RELATIONSHIPS.HAS_MANY
    );
    for (const relation of subRelations) {
      const child = model.children.find((item) => item.name === relation.model);
      // It should be recursive
      await _createRoutes(
        child,
        models,
        `${urlPrefix}${resource}/:${primaryKey}/`,
        model,
        relation
      );
    }
  }

  // Adding recursive model routes
  if (model.isRecursive && allowRecursive) {
    // We should different parameter name for child routes
    const primaryKey =
      pluralize.singular(model.name).toLowerCase() +
      ucFirst(model.instance.primaryKey);
    const relation = model.instance.relations.find(
      (relation) =>
        relation.model === model.name &&
        relation.type === RELATIONSHIPS.HAS_MANY
    );

    await _createRoutes(
      model,
      models,
      `${urlPrefix}${resource}/:${primaryKey}/`,
      model,
      relation,
      false
    );
  }
};

export default async (app, modelTree, appDirectory, models) => {
  Config = await IoC.use("Config");
  const logger = await IoC.use("Logger");
  const fs = await IoC.use("fs");
  const path = await IoC.use("path");
  const url = await IoC.use("url");

  for (const model of modelTree) {
    await _createRoutes(model, models);
  }

  // Calling the user's custom definitions
  const customInitFile = path.join(appDirectory, `init.js`);
  if (fs.existsSync(customInitFile)) {
    const { default: initter } = await import(
      url.pathToFileURL(customInitFile).href
    );
    await initter({ app });
  }

  logger.info("All routes have been created.");
};
