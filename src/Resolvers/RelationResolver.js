import IoC from "./../Core/IoC.js";
import { DEFAULT_METHODS_OF_MODELS } from "./../Constants.js";
import { paramCase } from "change-case";

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

export default async (models) => {
  const logger = await IoC.use("Logger");

  for (const model of models) {
    const methods = getMethods(model.instance).filter(
      (method) => !DEFAULT_METHODS_OF_MODELS.includes(method)
    );

    for (const method of methods) {
      const relation = model.instance[method]();
      model.instance.relations.push({
        name: method,
        resource: paramCase(method).toLowerCase(),
        ...relation,
      });
    }
  }

  logger.info("All relationships have been resolved.");
};
