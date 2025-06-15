import path from "path";
import fs from "fs";
import { AxeVersionConfig, IVersion, IVersionConfig } from "../Interfaces";
import AxeError from "../Exceptions/AxeError";
import { AxeErrorCode } from "../Enums";
import { DEFAULT_VERSION_CONFIG } from "../constants";

class VersionConfigResolver {
  private version: IVersion;

  constructor(version: IVersion) {
    this.version = version;
  }

  async resolve() {
    const versionConfigFile = path.join(this.version.folders.root, "config");
    if (
      !fs.existsSync(`${versionConfigFile}.ts`) &&
      !fs.existsSync(`${versionConfigFile}.js`)
    ) {
      throw new AxeError(
        AxeErrorCode.VERSION_CONFIG_NOT_FOUND,
        `The version file not found: ${versionConfigFile}.ts`,
      );
    }
    // Loading the configuration file
    const { default: content } = await import(versionConfigFile);
    // Merging the configurations with the default version configurations
    const apiConfiguration: AxeVersionConfig = {
      ...DEFAULT_VERSION_CONFIG,
      ...(content as IVersionConfig),
    };
    // Setting the config values
    this.version.config = apiConfiguration;
  }
}

export default VersionConfigResolver;
