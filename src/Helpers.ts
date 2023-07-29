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
