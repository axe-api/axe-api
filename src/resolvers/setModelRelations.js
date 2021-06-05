import IoC from "./../core/IoC.js";
import { DEFAULT_METHODS_OF_MODELS } from "./../constants.js";
import { paramCase } from "change-case";

const getInstanceMethods = (obj) => {
  let properties = new Set();
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).forEach((item) =>
      properties.add(item)
    );
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter(
    (item) => typeof obj[item] === "function"
  );
};

const getModelRelationMethods = (model) => {
  return getInstanceMethods(model.instance).filter(
    (method) => !DEFAULT_METHODS_OF_MODELS.includes(method)
  );
};

export default async (models) => {
  const logger = await IoC.use("Logger");

  for (const model of models) {
    const relationMethods = getModelRelationMethods(model);

    for (const relationMethod of relationMethods) {
      const relation = model.instance[relationMethod]();
      model.instance.relations.push({
        name: relationMethod,
        resource: paramCase(relationMethod).toLowerCase(),
        ...relation,
      });
    }
  }

  logger.info("All relationships have been resolved.");
};
