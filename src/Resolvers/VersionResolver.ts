import Validator from "validatorjs";
import { readdir } from "fs/promises";
import { APIService, LogService } from "../Services";
import AxeError from "../Exceptions/AxeError";
import { AxeErrorCode } from "../Enums";

const RESERVED_VERSION_FOLDERS: string[] = [
  "Config",
  "Events",
  "Hooks",
  "Models",
  "Serialization",
];

class VersionResolver {
  async resolve() {
    const logger = LogService.getInstance();
    await this.getVersions();
    logger.info("All API versions have been resolved.");
  }

  private async getVersions() {
    const api = APIService.getInstance();
    const versionFolders = await this.getDirectories(api.appFolder);
    this.checkReservedKeys(versionFolders);

    versionFolders.forEach((version) => {
      const validation = new Validator(
        { version },
        { version: "required|alpha_num" }
      );

      if (validation.fails()) {
        const { version: versionError } = validation.errors.errors;
        const [message] = versionError;
        throw new AxeError(
          AxeErrorCode.UNACCEPTABLE_VERSION_NAME,
          `${message} ("${version}")`
        );
      }

      api.addVersion(version);
    });
  }

  private async getDirectories(source: string) {
    return (await readdir(source, { withFileTypes: true }))
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  }

  private checkReservedKeys(names: string[]) {
    const reservedName = names.find((name) =>
      RESERVED_VERSION_FOLDERS.includes(name)
    );
    if (reservedName) {
      throw new AxeError(
        AxeErrorCode.RESERVED_VERSION_NAME,
        `You can not use a reserved name in the app directory: ${reservedName}`
      );
    }
  }
}

export default VersionResolver;
