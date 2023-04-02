import { Response } from "express";
import { IResponse } from "../../Interfaces";
import BaseResponse from "./BaseResponse";

class ExpressResponse extends BaseResponse implements IResponse {
  private response: Response;

  constructor(response: Response) {
    super();
    this.response = response;
  }

  append(name: string, value: any): IResponse {
    this.response.append(name, value);
    return this as unknown as IResponse;
  }

  redirect(url: string): IResponse {
    this.response.redirect(url);
    return this as unknown as IResponse;
  }

  deleteHeader(name: string): IResponse {
    this.response.removeHeader(name);
    return this as unknown as IResponse;
  }

  attachment(path: string): IResponse {
    this.response.attachment(path);
    return this as unknown as IResponse;
  }

  setCookie(name: string, value: string, options: any): IResponse {
    this.response.cookie(name, value, options);
    return this as unknown as IResponse;
  }

  clearCookie(name: string, options: any): IResponse {
    this.response.clearCookie(name, options);
    return this as unknown as IResponse;
  }

  setHeader(name: string, value: string): IResponse {
    this.response.setHeader(name, value);
    return this as unknown as IResponse;
  }

  status(status: number): IResponse {
    this.response.status(status);
    return this as unknown as IResponse;
  }

  send(data?: any): IResponse {
    this.response.send(data);
    return this as unknown as IResponse;
  }

  json(data?: any): IResponse {
    this.response.json(data);
    return this as unknown as IResponse;
  }
}

export default ExpressResponse;
