import fs from "fs";
import path from "path";
import url from "url";
import pluralize from "pluralize";
import IoC from "./../Core/IoC.js";

const _getChildrens = (model, map) => {
  const relationNames = model.instance.relations
    .filter((item) => item.type === "HasMany")
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
      item.instance.relations.filter((relation) => relation.type === "HasOne")
        .length === 0
  );

  for (const model of tree) {
    model.children = _getChildrens(model, map);
  }

  return tree;
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

const _createRoutes = async (parentUrl, parentModel, model) => {
  const App = await IoC.use("App");
  const Controller = await IoC.use("Controller");
  const Config = await IoC.use("Config");
  const Database = await IoC.use("Database");
  const Logger = await IoC.use("Logger");

  const pack = {
    model,
    parentModel,
    Config,
    Database,
    Logger,
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
    App.get(`/api/${parentUrl}${resource}`, (req, res) => {
      Controller.paginate({
        ...pack,
        request: req,
        response: res,
      });
    });
    App.get(`/api/${parentUrl}${resource}/:id`, (req, res) => {
      Controller.show({
        ...pack,
        request: req,
        response: res,
      });
    });
  }

  if (actions.includes("POST")) {
    App.post(`/api/${parentUrl}${resource}`, (req, res) => {
      Controller.store({
        ...pack,
        request: req,
        response: res,
      });
    });
  }

  if (actions.includes("PUT")) {
    App.put(`/api/${parentUrl}${resource}/:id`, (req, response) => {
      Controller.update({
        ...pack,
        request: req,
        response: res,
      });
    });
  }

  if (actions.includes("DELETE")) {
    App.delete(`/api/${parentUrl}${resource}/:id`, (req, response) => {
      Controller.delete({
        ...pack,
        request: req,
        response: res,
      });
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
  for (const model of map) {
    await _createRoutes("", "", model);
  }
};
