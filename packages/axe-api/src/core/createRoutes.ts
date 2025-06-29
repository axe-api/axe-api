import findMyWay from "find-my-way";
import { Resource } from "../definers";
import paginateHandler from "../newHandlers/paginateHandler";

const core = findMyWay();

export type Route = {
  prefix: string;
  resource?: Resource<unknown>;
  middlewares: unknown[];
  children: Route[];
  use(middleware: unknown): Route;
  root(resource: Resource<any>): Route;
  with(resource: Resource<any>): Route;
  group(name: string, callback: (group: Route) => void): Route;

  /**
   * @internal
   */
  addRoute(route: Route): void;
};

export const createRoutes = (prefix = ""): Route => {
  const middlewares: unknown[] = [];
  const children: Route[] = [];

  const current: Route = {
    prefix,
    children,
    middlewares,

    use(middleware) {
      this.middlewares.push(middleware);
      return this;
    },

    addRoute(route: Route) {
      this.children.push(route);

      console.log(route.prefix);
      const paginate = (route.resource?.config.handlers || []).find(
        (item) => item.type === "paginate",
      );
      if (paginate) {
        core.on("GET", route.prefix, (req, res) => paginateHandler(req, res));
      }
    },

    root(resource: Resource<unknown>) {
      const child = createRoutes(`${this.prefix}/${resource.config.tableName}`);
      child.resource = resource;
      this.addRoute(child);
      return child;
    },

    with(resource: Resource<unknown>) {
      const child = createRoutes(`${this.prefix}/${resource.config.tableName}`);
      child.resource = resource;
      this.addRoute(child);
      return child;
    },

    group(name, callback) {
      const subGroup = createRoutes(`${this.prefix}/${name}`);
      this.children.push(subGroup);
      callback(subGroup);
      return subGroup;
    },
  };

  return current;
};

export const getCoreRouter = () => {
  return core;
};
