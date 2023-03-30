import { Frameworks } from "../Enums";
import { IFramework, AxeRequest, AxeResponse } from "../Interfaces";
import LogService from "../Services/LogService";

export abstract class ExpressRequest implements AxeRequest {
  type= "express";
  abstract url: string;
  abstract method: string;
  abstract body: any;
  abstract baseUrl: string;
  abstract hostname: string;
  abstract ip: string;
  abstract ips: string;
  abstract originalUrl: string;
  abstract params: any;
  abstract path: string;
  abstract protocol: "http" | "https";
  abstract query: any;
  abstract headers: any;
  abstract currentLanguage: any;
  abstract param(name: string): string;
  abstract get(name: string): string ; 
  getHeader(name: string): string | null {
    return this.get(name);
  }
  setHeader(name: string, value: any): void {
    this.headers[name] = value;
  }
  deleteHeader(name: string): void {
   delete this.headers[name];
  }
}

export abstract class ExpressResponse implements AxeResponse{
  abstract cookie: any;
  abstract set: any;
  abstract get: any;
  abstract removeHeader(name: string): any;
  abstract appand(name: string, value: any): void;
  abstract clearCookie(name: string, options: any): void;
  abstract getHeaders(): Record<string, string> | null
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
    this.set(name, value)
  }
  deleteHeader(name: string): void {
    this.removeHeader(name);
  }
}

export type ExpressHandler = (req: ExpressRequest, res: ExpressResponse, next: any) => Promise<any> | void ;

class ExpressFramework implements IFramework {
  client: any;
  _name: Frameworks;

  constructor(express: any) {
    try {
      const { Express } = express;
      this.client = express() as typeof Express;
      this._name = Frameworks.Express;
    } catch (error: any) {
      if(error.code === 'MODULE_NOT_FOUND'){
        const logger = LogService.getInstance();
        logger.error(`Express framework didn't install. Run: "npm install express"`);
      }
      throw error;
    }
  }

  get(url: string, middleware: ExpressHandler | ExpressHandler[], handler?: ExpressHandler) {
    if (handler) {
      this.client.get(url, middleware, handler)
    } else {
      this.client.get(url, middleware)
    }
  }

  // post(url: string, handler: ExpressHandler){
  //     this.client.post(url, handler);
  // }
  post(url: string, middleware: ExpressHandler | ExpressHandler[], handler?: ExpressHandler) {
    if (handler) {
      this.client.post(url, middleware, handler)
    } else {
      this.client.post(url, middleware)
    }
  }
  // put(url: string, handler: ExpressHandler){
  //     this.client.put(url, handler);
  // }
  put(url: string, middleware: ExpressHandler | ExpressHandler[], handler?: ExpressHandler) {
    if (handler) {
      this.client.put(url, middleware, handler)
    } else {
      this.client.put(url, middleware)
    }
  }
  // delete(url: string, handler: ExpressHandler){
  //     this.client.delete(url, handler);
  // }
  delete(url: string, middleware: ExpressHandler | ExpressHandler[], handler?: ExpressHandler) {
    if (handler) {
      this.client.delete(url, middleware, handler)
    } else {
      this.client.delete(url, middleware)
    }
  }
  // patch(url: string, handler: ExpressHandler){
  //     this.client.patch(url, handler);
  // }
  patch(url: string, middleware: ExpressHandler | ExpressHandler[], handler?: ExpressHandler) {
    if (handler) {
      this.client.patch(url, middleware, handler)
    } else {
      this.client.patch(url, middleware)
    }
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

export default ExpressFramework