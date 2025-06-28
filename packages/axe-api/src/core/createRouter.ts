import { Resource } from "src/definers";

export type Router = {
  prefix: string;
  resource?: Resource<unknown>;
  middlewares: unknown[];
  children: Router[];
  use(middleware: unknown): Router;
  root(resource: Resource<any>): Router;
  with(resource: Resource<any>): Router;
  group(name: string, callback: (group: Router) => void): Router;
};

export const createRouter = (prefix = ""): Router => {
  const middlewares: unknown[] = [];
  const children: Router[] = [];

  const current: Router = {
    prefix,
    children,
    middlewares,

    use(middleware) {
      this.middlewares.push(middleware);
      return this;
    },

    root(resource: Resource<unknown>) {
      const child = createRouter(`${this.prefix}/${resource.config.tableName}`);
      child.resource = resource;
      this.children.push(child);
      return child;
    },

    with(resource: Resource<unknown>) {
      const child = createRouter(`${this.prefix}/${resource.config.tableName}`);
      child.resource = resource;
      this.children.push(child);
      return child;
    },

    group(name, callback) {
      const subGroup = createRouter(`${this.prefix}/${name}`);
      this.children.push(subGroup);
      callback(subGroup);
      return subGroup;
    },
  };

  return current;
};
