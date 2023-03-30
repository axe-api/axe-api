/* eslint-disable @typescript-eslint/no-var-requires */
import { AxeRequest, AxeResponse, IFramework, IFrameworkHandler } from "../Interfaces";
import { Frameworks } from "../Enums";
import LogService from "../Services/LogService";



export abstract class FastifyRequest implements AxeRequest {
  type= "fastify";
  abstract url: string;
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

  abstract reaquestMethod: string;
  get method(): string{
    return this.reaquestMethod;
  }
  getHeader(name: string): string | null {
    return this.headers[name];
  }
  setHeader(name: string, value: any): void {
    this.headers[name] = value;
  }
  deleteHeader(name: string): void {
    delete this.headers[name];
  }
}

export abstract class FastifyResponse implements AxeResponse {
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
  abstract header(name: string, value: string): any;
  setCookie(name: string, value: string, options: any): void {
    this.cookie(name, value, options);
  }
  getHeader(name: string): string | null {
   return this.get(name);
  }
  setHeader(name: string, value: string): void {
    this.header(name, value);
  }
  deleteHeader(name: string): void {
    this.removeHeader(name);
  }
}

export type ExpressHandler = (req: FastifyRequest, res: FastifyResponse, next: any) => Promise<any> | void ;

function updateHandler( handler: any ) {
  // Add Express function in to the Fastify request and response
  return ( req: any, res: any, next: any ) => {
    // Request
    req.get = (headerName: string) => req.headers[headerName];
    
    // Response
    res.json = res.send;
    res.setHeader = (name: string, value: string) => res.header(name, value);

    handler(req, res, next);
  }
}

function updateReqResToExpressish(middlewares: any, handler: any){
  if(!Array.isArray(middlewares)){
    middlewares = [middlewares];
  }
  middlewares= middlewares.map((middleware: any) => updateHandler(middleware));

  if(handler){
    handler = updateHandler(handler);
  }
  return [handler, middlewares];
}

class FastifyFramework implements IFramework {
  client: any;
  _name: Frameworks;
  _helpers: Record<string, any> | undefined ;
  constructor(fastify: any) {
    try {
      this.client = fastify();
      this._name = Frameworks.Fastify;
    } catch (error: any) {
      if(error.code === 'MODULE_NOT_FOUND'){
        const logger = LogService.getInstance();
       logger.error(`Fastify framework didn't install. Run: "npm install fastify @fastify/middie"`);
      }
      throw error;
    }
  }

  private handleMethod(method: string, url:string, middlewares: any, handler: any){
    const [_handler, _middleware] = updateReqResToExpressish(middlewares, handler);
    if (_handler) {
      // @ts-ignore
      this.client[method](url, { preHandler: _middleware as any }, _handler as any);
    } else {
      // @ts-ignore
      this.client[method](url, _middleware[0] as any);
    }
  }

  get(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler | undefined) {
    this.handleMethod('get', url, middleware, handler);
  }
  post(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler | undefined) {
    this.handleMethod('post', url, middleware, handler);
  }
  put(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler | undefined) {
    this.handleMethod('put', url, middleware, handler);
  }
  delete(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler | undefined) {
    this.handleMethod('delete', url, middleware, handler);
  }
  patch(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler | undefined) {
    this.handleMethod('patch', url, middleware, handler);
  }
  use(middleware: IFrameworkHandler) {
    this.client.register(require('@fastify/middie')).then(() => {
      return this.client.use(middleware);
    })
  }
  listen(port: number, fn: () => void) {
    return this.client.listen({ port }, fn);
  }
  kill(): void {
    throw new Error("Method not implemented.");
  }
}

export default FastifyFramework;
