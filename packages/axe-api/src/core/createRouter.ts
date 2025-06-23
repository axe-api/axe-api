import { Resource } from "src/definers";

export type Version = {
  prefix: string;
  resources: Resource<unknown>[];
};

export type VersionGroup = () => Resource<any>[];

export type Router = {
  /**
   * @internal
   */
  config: Version[];

  version(name: string, callback: VersionGroup): Router;
};

export const createRouter = (prefix: string) => {
  const config: Version[] = [];

  return {
    config,

    version(name: string, callback: VersionGroup) {
      const version: Version = {
        prefix: `${prefix}/${name}`,
        resources: callback() as Resource<unknown>[],
      };

      config.push(version);

      return this;
    },
  } as Router;
};
