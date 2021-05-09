import path from "path";
import fs from "fs";
import url from "url";

class Config {
  constructor() {
    this._isLoaded = false;
  }

  async load(directory) {
    if (this._isLoaded) {
      return;
    }

    directory = path.join(directory, "Config");
    const files = fs.readdirSync(directory);
    for (const file of files) {
      const configFile = url.pathToFileURL(path.join(directory, file)).href;
      let { default: configuration } = await import(configFile);

      if (typeof configuration === "function") {
        configuration = await configuration();
      }

      const key = file.replace(".js", "");
      if (key === "load") {
        throw new Error(
          `This is a reserved name. You can not use this name as a configuration file name: "load"`
        );
      }

      this[key] = configuration;
    }
    this._isLoaded = true;
  }
}

export default Config;
