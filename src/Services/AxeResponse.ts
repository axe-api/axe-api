import { ServerResponse } from "http";
import { ILanguage } from "src/Interfaces";

class AxeResponse {
  private response: ServerResponse;
  private responseStatus = false;
  private language: ILanguage;

  constructor(response: ServerResponse, language: ILanguage) {
    this.response = response;
    this.response.statusCode = 200;
    this.language = language;
  }

  get original() {
    return this.response;
  }

  status(statusCode: number) {
    this.response.statusCode = statusCode;
    return this;
  }

  json(data: object) {
    this.response.setHeader("Content-Type", "application/json");
    this.response.setHeader("Content-Language", this.language.language);
    this.response.write(JSON.stringify(data));
    this.response.end();
    this.responseStatus = true;
  }

  send(content: string) {
    this.response.write(content);
    this.response.end();
    this.responseStatus = true;
  }

  noContent() {
    this.response.statusCode = 204;
    this.response.end();
    this.responseStatus = true;
  }

  isResponded() {
    return this.responseStatus;
  }

  statusCode() {
    return this.response.statusCode;
  }
}

export default AxeResponse;
