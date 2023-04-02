import { Express } from "express";
import { Frameworks } from "../../Enums";
import { IFramework } from "../../Interfaces";
import LogService from "../../Services/LogService";

export type ExpressHandler = (
  req: any,
  res: any,
  next: any
) => Promise<any> | void;

class ExpressFramework implements IFramework {
  private client: Express | undefined;
  public name: Frameworks = Frameworks.Express;

  async init(): Promise<void> {
    try {
      const express = (await import("express")).default;
      this.client = express();
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
    handler: ExpressHandler
  ) {
    this.client?.get(url, middleware, handler);
  }

  post(
    url: string,
    middleware: ExpressHandler | ExpressHandler[],
    handler: ExpressHandler
  ) {
    this.client?.post(url, middleware, handler);
  }

  put(
    url: string,
    middleware: ExpressHandler | ExpressHandler[],
    handler: ExpressHandler
  ) {
    this.client?.put(url, middleware, handler);
  }

  delete(
    url: string,
    middleware: ExpressHandler | ExpressHandler[],
    handler: ExpressHandler
  ) {
    this.client?.delete(url, middleware, handler);
  }

  patch(
    url: string,
    middleware: ExpressHandler | ExpressHandler[],
    handler: ExpressHandler
  ) {
    this.client?.patch(url, middleware, handler);
  }

  use(middleware: ExpressHandler): any {
    return this.client?.use(middleware);
  }

  listen(port: number, fn: () => void): any {
    return this.client?.listen(port, fn);
  }

  kill(): void {
    throw new Error("Method not implemented.");
  }
}

export default ExpressFramework;
