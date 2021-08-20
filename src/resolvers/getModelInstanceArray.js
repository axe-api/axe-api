import IoC from "./../core/IoC.js";

export default async (appDirectory) => {
  const logger = await IoC.use("Logger");
  const fs = await IoC.use("fs");
  const path = await IoC.use("path");
  const url = await IoC.use("url");

  appDirectory = path.join(appDirectory, "Models");
  const models = [];
  const files = fs
    .readdirSync(appDirectory)
    .filter((file) => file.split(".").pop() === "js");

  for (const file of files) {
    const modelName = file.replace(".js", "");
    const modelFile = url.pathToFileURL(path.join(appDirectory, file)).href;
    const { default: Model } = await import(modelFile);
    models.push({
      name: modelName,
      instance: new Model(),
    });
  }

  logger.info("Models have been resolved!");
  return models;
};
