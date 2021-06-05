import IoC from "./../core/IoC.js";
import { RELATIONSHIPS } from "./../constants.js";

const getChildModelNames = (model) => {
  return model.instance.relations
    .filter((item) => item.type === RELATIONSHIPS.HAS_MANY)
    .map((item) => item.model);
};

const _setChildrens = (model, models) => {
  const childModelNames = getChildModelNames(model);
  model.children = models.filter((item) => childModelNames.includes(item.name));
  for (const child of model.children) {
    _setChildrens(child, models);
  }
};

const getRootLevelOfTree = (models) => {
  return models.filter(
    (item) =>
      !item.instance.relations.some(
        (relation) => relation.type === RELATIONSHIPS.HAS_ONE
      )
  );
};

const createRecursiveTree = (tree, models) => {
  for (const model of tree) {
    _setChildrens(model, models);
  }
};

const addNestedRoutes = (tree, models) => {
  // We should add recursive models
  models.forEach((model) => {
    const recursiveRelations = model.instance.relations.filter(
      (relation) => relation.model === model.name
    );

    if (recursiveRelations.length === 2) {
      tree.push({
        isRecursive: true,
        children: [],
        ...model,
      });
    }
  });
};

export default async (models) => {
  const logger = await IoC.use("Logger");

  const tree = getRootLevelOfTree(models);
  createRecursiveTree(tree, models);
  addNestedRoutes(tree, models);

  logger.info("Model tree map has been created.");
  return tree;
};
