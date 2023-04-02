/* eslint-disable @typescript-eslint/no-var-requires */
import {
  IFramework,
  IFrameworkHandler,
  IRequest,
  IResponse,
} from "../../Interfaces";
import { Frameworks } from "../../Enums";
import LogService from "../../Services/LogService";

export type ExpressHandler = (
  req: IRequest,
  res: IResponse,
  next: any
) => Promise<any> | void;

function updateHandler(handler: any) {
  // Add Express function in to the Fastify request and response
  return (req: any, res: any, next: any) => {
    // Request
    req.get = (headerName: string) => req.headers[headerName];

    // Response
    res.json = res.send;
    res.setHeader = (name: string, value: string) => res.header(name, value);

    handler(req, res, next);
  };
}

function updateReqResToExpressish(middlewares: any, handler: any) {
  if (!Array.isArray(middlewares)) {
    middlewares = [middlewares];
  }
  middlewares = middlewares.map((middleware: any) => updateHandler(middleware));

  if (handler) {
    handler = updateHandler(handler);
  }
  return [handler, middlewares];
}

class FastifyFramework implements IFramework {
  client: any;
  _helpers: Record<string, any> | undefined;
  public name: Frameworks = Frameworks.Fastify;

  async init(): Promise<void> {
    try {
      const fastify = (await import("fastify")).default;
      this.client = fastify();
    } catch (error: any) {
      if (error.code === "MODULE_NOT_FOUND") {
        const logger = LogService.getInstance();
        logger.error(
          `Fastify framework didn't install. Run: "npm install fastify @fastify/middie"`
        );
      }
      throw error;
    }
  }

  getFramework() {
    return this.client;
  }

  private handleMethod(
    method: string,
    url: string,
    middlewares: any,
    handler: any
  ) {
    const [_handler, _middleware] = updateReqResToExpressish(
      middlewares,
      handler
    );
    if (_handler) {
      this.client[method](
        url,
        { preHandler: _middleware as any },
        _handler as any
      );
    } else {
      this.client[method](url, _middleware[0] as any);
    }
  }

  get(
    url: string,
    middleware: IFrameworkHandler | IFrameworkHandler[],
    handler?: IFrameworkHandler | undefined
  ) {
    this.handleMethod("get", url, middleware, handler);
  }
  post(
    url: string,
    middleware: IFrameworkHandler | IFrameworkHandler[],
    handler?: IFrameworkHandler | undefined
  ) {
    this.handleMethod("post", url, middleware, handler);
  }
  put(
    url: string,
    middleware: IFrameworkHandler | IFrameworkHandler[],
    handler?: IFrameworkHandler | undefined
  ) {
    this.handleMethod("put", url, middleware, handler);
  }
  delete(
    url: string,
    middleware: IFrameworkHandler | IFrameworkHandler[],
    handler?: IFrameworkHandler | undefined
  ) {
    this.handleMethod("delete", url, middleware, handler);
  }
  patch(
    url: string,
    middleware: IFrameworkHandler | IFrameworkHandler[],
    handler?: IFrameworkHandler | undefined
  ) {
    this.handleMethod("patch", url, middleware, handler);
  }
  use(middleware: IFrameworkHandler) {
    this.client.register(require("@fastify/middie")).then(() => {
      return this.client.use(middleware);
    });
  }
  listen(port: number, fn: () => void) {
    return this.client.listen({ port }, fn);
  }
  kill(): void {
    throw new Error("Method not implemented.");
  }
}

export default FastifyFramework;
