import { Request } from "express";
import IRequest from "./IRequest";
import BaseRequest from "./BaseRequest";

export class ExpressRequest extends BaseRequest implements IRequest {
  private request: Request;

  constructor(request: Request) {
    super();
    this.request = request;
  }

  get path() {
    return this.request.path;
  }

  get url() {
    return this.request.url;
  }

  get method() {
    return this.request.method;
  }

  get body() {
    return this.request.body;
  }

  get baseUrl() {
    return this.request.baseUrl;
  }

  get hostname() {
    return this.request.hostname;
  }

  get ip() {
    return this.request.ip;
  }

  get ips() {
    return this.request.ips;
  }

  get originalUrl() {
    return this.request.originalUrl;
  }

  get params() {
    return this.request.params;
  }

  get protocol() {
    return this.request.protocol;
  }

  get query() {
    return this.request.query;
  }

  getHeader(name: string): string | null {
    return this.request.get(name) || null;
  }

  param(name: string) {
    return this.request.param(name);
  }
}
