import fs from "fs";
import path from "path";
import url from "url";
import pluralize from "pluralize";
import IoC from "./../Core/IoC.js";
import {
  HOOK_FUNCTIONS,
  RELATIONSHIPS,
  DEFAULT_METHODS_OF_MODELS,
} from "./../Constants.js";

let Controller = null;
let Config = null;

const _getChildrens = (model, map) => {
  const relationNames = model.instance.relations
    .filter((item) => item.type === RELATIONSHIPS.HAS_MANY)
    .map((item) => item.model);

  const children = map.filter((item) => relationNames.indexOf(item.name) > -1);
  for (const child of children) {
    child.children = _getChildrens(child, map);
  }
  return children;
};

export const createModelTree = (map) => {
  const tree = map.filter(
    (item) =>
      item.instance.relations.filter(
        (relation) => relation.type === RELATIONSHIPS.HAS_ONE
      ).length === 0
  );

  for (const model of tree) {
    model.children = _getChildrens(model, map);
  }

  return tree;
};

const toPath = (path) => {
  return url.pathToFileURL(path).href;
};

export const setActions = async (directory, models) => {
  await setHooks("Actions", directory, models);
};

export const setHooks = async (type, directory, models) => {
  directory = path.join(directory, type);
  for (const model of models) {
    model[type.toLowerCase()] = {};
    const fileName = path.join(directory, `${model.name}${type}.js`);
    if (fs.existsSync(fileName)) {
      const Hooks = await import(toPath(fileName));
      for (const hook of Object.keys(HOOK_FUNCTIONS)) {
        if (Hooks[hook]) {
          model[type.toLowerCase()][hook] = Hooks[hook];
        }
      }
    }
  }
};

export const getModels = async (directory) => {
  directory = path.join(directory, "Models");
  const instances = [];
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const modelName = file.replace(".js", "");
    const modelFile = url.pathToFileURL(path.join(directory, file)).href;
    const { default: Model } = await import(modelFile);
    instances.push({
      name: modelName,
      instance: new Model(),
    });
  }
  return instances;
};

const handleErrors = (req, res, error) => {
  const status = error.type === "ApiError" ? error.status : 400;
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

const callController = async (method, req, res, pack) => {
  try {
    await Controller[method]({
      ...pack,
      request: req,
      response: res,
    });
  } catch (error) {
    handleErrors(req, res, error);
  }
};

const _createRoutes = async (parentUrl, parentModel, model) => {
  const App = await IoC.use("App");
  const Database = await IoC.use("Database");
  const Logger = await IoC.use("Logger");
  const QueryParser = await IoC.use("QueryParser");

  const pack = {
    model,
    parentModel,
    Config,
    Database,
    Logger,
    QueryParser,
  };

  const resource = pluralize
    .plural(
      pluralize
        .singular(model.name)
        .replace(pluralize.singular(parentModel), "")
    )
    .toLowerCase();

  const actions = model.instance.actions;

  if (actions.includes("GET")) {
    App.get(`/api/${parentUrl}${resource}`, async (req, res) => {
      await callController("paginate", req, res, pack);
    });
    App.get(`/api/${parentUrl}${resource}/:id`, async (req, res) => {
      await callController("show", req, res, pack);
    });
  }

  if (actions.includes("POST")) {
    App.post(`/api/${parentUrl}${resource}`, async (req, res) => {
      await callController("store", req, res, pack);
    });
  }

  if (actions.includes("PUT")) {
    App.put(`/api/${parentUrl}${resource}/:id`, async (req, res) => {
      await callController("update", req, res, pack);
    });
  }

  if (actions.includes("DELETE")) {
    App.delete(`/api/${parentUrl}${resource}/:id`, async (req, res) => {
      await callController("delete", req, res, pack);
    });
  }

  if (model.children.length > 0) {
    // We should different parameter name for child routes
    const idKey = pluralize.singular(resource) + "Id";
    for (const child of model.children) {
      // It should be recursive
      await _createRoutes(
        `${parentUrl}${resource}/:${idKey}/`,
        model.name,
        child
      );
    }
  }
};

export const setRoutes = async (map) => {
  Controller = await IoC.use("Controller");
  Config = await IoC.use("Config");
  for (const model of map) {
    await _createRoutes("", "", model);
  }
};

const getMethods = (obj) => {
  let properties = new Set();
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter(
    (item) => typeof obj[item] === "function"
  );
};

export const setRelationArrays = async (models) => {
  for (const model of models) {
    const methods = getMethods(model.instance).filter(
      (method) => !DEFAULT_METHODS_OF_MODELS.includes(method)
    );

    for (const method of methods) {
      model.instance.relations.push(model.instance[method]());
    }
  }
};
