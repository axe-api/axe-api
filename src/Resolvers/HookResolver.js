import IoC from "./../Core/IoC.js";
import { HOOK_FUNCTIONS } from "./../Constants.js";

export default async (type, appDirectory, models) => {
  const logger = await IoC.use("Logger");
  const fs = await IoC.use("fs");
  const path = await IoC.use("path");
  const url = await IoC.use("url");

  appDirectory = path.join(appDirectory, type);
  for (const model of models) {
    model[type.toLowerCase()] = {};
    const fileName = path.join(appDirectory, `${model.name}${type}.js`);
    if (fs.existsSync(fileName)) {
      const Hooks = await import(url.pathToFileURL(fileName).href);
      for (const hook of Object.keys(HOOK_FUNCTIONS)) {
        if (Hooks[hook]) {
          model[type.toLowerCase()][hook] = Hooks[hook];
        }
      }
    }
  }

  logger.info(`${type} have been mapped.`);
};
