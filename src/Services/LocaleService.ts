import fs from "fs";
import path from "path";
import LogService from "./LogService";
import { ILocale, IVersion } from "../Interfaces";
import { getFileContentAsFlattenObject } from "../Helpers";

const DATA: Record<string, Record<string, ILocale>> = {};

const DEFUALT_LOCALE = {
  fields: {},
};

class LocaleService {
  static async load(version: IVersion) {
    if (!fs.existsSync(version.folders.locales)) {
      LogService.warn(`Locale folder is not found: ${version.folders.locales}`);
      return;
    }

    if (!DATA[version.name]) {
      DATA[version.name] = {};
    }

    const locales = fs
      .readdirSync(version.folders.locales)
      .filter((file) =>
        fs.statSync(path.join(version.folders.locales, file)).isDirectory(),
      );

    for (const locale of locales) {
      DATA[version.name][locale] = { ...DEFUALT_LOCALE };

      const fieldsFile = path.join(
        version.folders.locales,
        locale,
        "fields.json",
      );

      const fields = getFileContentAsFlattenObject(fieldsFile);

      DATA[version.name][locale].fields = fields;
      LogService.debug(`Locale files have been imported: ${locale}`);
    }
  }

  static getFields(version: IVersion, locale: string) {
    if (!DATA[version.name] || !DATA[version.name][locale]) {
      return {};
    }

    return DATA[version.name][locale].fields;
  }
}

export default LocaleService;
