import IoC from "./../Core/IoC.js";
import { RELATIONSHIPS } from "./../Constants.js";

const _setChildrens = (model, models) => {
  const relationNames = model.instance.relations
    .filter((item) => item.type === RELATIONSHIPS.HAS_MANY)
    .map((item) => item.model);

  model.children = models.filter(
    (item) => relationNames.indexOf(item.name) > -1
  );
  for (const child of model.children) {
    _setChildrens(child, models);
  }
};

export default async (models) => {
  const logger = await IoC.use("Logger");

  const tree = models.filter(
    (item) =>
      item.instance.relations.filter(
        (relation) => relation.type === RELATIONSHIPS.HAS_ONE
      ).length === 0
  );

  for (const model of tree) {
    _setChildrens(model, models);
  }

  logger.info("Model tree map has been created.");
  return tree;
};
