import path from "path";
import fs from "fs";
import { IVersion, IVersionConfig } from "../Interfaces";
import AxeError from "../Exceptions/AxeError";
import { AxeErrorCode } from "../Enums";

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
        `The version file not found: ${versionConfigFile}.ts`
      );
    }
    const { default: content } = await import(versionConfigFile);
    this.version.config = content as IVersionConfig;
  }
}

export default VersionConfigResolver;
