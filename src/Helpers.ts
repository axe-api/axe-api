import fs from "fs";
import { APIService } from "./Services";
import { IVersion } from "./Interfaces";

export const getVersionByRequest = (urlObject: URL): IVersion | undefined => {
  // Application configuration is need for the default setting.
  const api = APIService.getInstance();
  const matchedVersion = api.versions.find((version) => {
    const path = `/${api.config.prefix}/${version.name}`;
    return urlObject.pathname.startsWith(path);
  });

  return matchedVersion;
};

export const flattenObject = (obj: any, parentKey = "") => {
  if (!obj) {
    return {};
  }

  return Object.keys(obj).reduce((acc: any, key) => {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], newKey));
    } else {
      acc[newKey] = obj[key];
    }
    return acc;
  }, {});
};

export const getFileContentAsFlattenObject = (filename: string) => {
  if (!fs.existsSync(filename)) {
    return {};
  }

  const content = fs.readFileSync(filename, "utf-8");

  try {
    const jsonContent = JSON.parse(content);
    return flattenObject(jsonContent);
  } catch (error: any) {
    throw new Error(`JSON conversion error on ${filename}: ${error.message}`);
  }
};
