import { Frameworks } from "../Enums";
import { IFramework, AxeResponse } from "../Interfaces";
import LogService from "../Services/LogService";

export abstract class ExpressResponse implements AxeResponse {
  abstract cookie: any;
  abstract set: any;
  abstract get: any;
  abstract removeHeader(name: string): any;
  abstract appand(name: string, value: any): void;
  abstract clearCookie(name: string, options: any): void;
  abstract getHeaders(): Record<string, string> | null;
  abstract status(status: number): AxeResponse;
  abstract redirect(url: string): void;
  abstract send(data?: any): void;
  abstract json(data?: any): void;
  setCookie(name: string, value: string, options: any): void {
    this.cookie(name, value, options);
  }
  getHeader(name: string): string | null {
    return this.get(name);
  }
  setHeader(name: string, value: string): void {
    this.set(name, value);
  }
  deleteHeader(name: string): void {
    this.removeHeader(name);
  }
}

export type ExpressHandler = (
  req: any,
  res: any,
  next: any
) => Promise<any> | void;

class ExpressFramework implements IFramework {
  client: any;
  _name: Frameworks;

  constructor(express: any) {
    try {
      const { Express } = express;
      this.client = express() as typeof Express;
      this._name = Frameworks.Express;
    } catch (error: any) {
      if (error.code === "MODULE_NOT_FOUND") {
        const logger = LogService.getInstance();
        logger.error(
          `Express framework didn't install. Run: "npm install express"`
        );
      }
      throw error;
    }
  }

  get(
    url: string,
    middleware: ExpressHandler | ExpressHandler[],
    handler?: ExpressHandler
  ) {
    this.client.get(url, middleware, handler);
  }

  post(
    url: string,
    middleware: ExpressHandler | ExpressHandler[],
    handler?: ExpressHandler
  ) {
    this.client.post(url, middleware, handler);
  }

  put(
    url: string,
    middleware: ExpressHandler | ExpressHandler[],
    handler?: ExpressHandler
  ) {
    this.client.put(url, middleware, handler);
  }

  delete(
    url: string,
    middleware: ExpressHandler | ExpressHandler[],
    handler?: ExpressHandler
  ) {
    this.client.delete(url, middleware, handler);
  }

  patch(
    url: string,
    middleware: ExpressHandler | ExpressHandler[],
    handler?: ExpressHandler
  ) {
    this.client.patch(url, middleware, handler);
  }

  use(middleware: ExpressHandler): any {
    return this.client.use(middleware);
  }

  listen(port: number, fn: () => void): any {
    return this.client.listen(port, fn);
  }

  kill(): void {
    throw new Error("Method not implemented.");
  }
}

export default ExpressFramework;
