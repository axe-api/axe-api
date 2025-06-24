import { Resource } from "src/definers";

export type Version = {
  prefix: string;
  resources: Resource<unknown>[];
};

export type RouteGrouper = (router: Router) => void;

export type Router = {
  /**
   * @internal
   */
  config: Version[];

  /**
   * @internal
   */
  children: Router[];

  /**
   * @internal
   */
  prefix: string;

  /**
   * @internal
   */
  middlewares: unknown[];

  /**
   * @internal
   */
  reosurces: Resource<unknown>[];

  group(name: string, callback: RouteGrouper): Router;
  use(middleware: unknown): Router;
  mount(resource: Resource<any>): Router;
};

export const createRouter = (prefix: string) => {
  const config: Version[] = [];
  const children: Router[] = [];
  const middlewares: unknown[] = [];
  const reosurces: Resource<unknown>[] = [];

  return {
    config,
    children,
    prefix,
    middlewares,
    reosurces,

    use(middleware) {
      middlewares.push(middleware);
      return this;
    },
    mount(resource) {
      reosurces.push(resource);
      return this;
    },
    group(name: string, callback: RouteGrouper) {
      const subRouter: Router = createRouter(`${prefix}/${name}`);
      children.push(subRouter);
      callback(subRouter);
      return subRouter;
    },
  } as Router;
};
