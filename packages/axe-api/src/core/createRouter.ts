import { Resource } from "src/definers";

export type Version = {
  prefix: string;
  resources: Resource<unknown>[];
};

export type GroupRouter = {
  use(middleware: unknown): GroupRouter;
  mount(resource: Resource<any>): GroupRouter;
};

export type VersionGroup = (router: GroupRouter) => void;

export type Router = {
  /**
   * @internal
   */
  config: Version[];

  group(name: string, callback: VersionGroup): Router;
};

export const createRouter = (prefix: string) => {
  const config: Version[] = [];

  return {
    config,

    group(name: string, callback: VersionGroup) {
      const subrouter: GroupRouter = {
        use(middleware) {
          console.log("use", middleware);
          return this;
        },
        mount(resource) {
          console.log("mount", resource);
          return this;
        },
      };

      callback(subrouter);

      const version: Version = {
        prefix: `${prefix}/${name}`,
        resources: [],
      };

      config.push(version);

      return this;
    },
  } as Router;
};
