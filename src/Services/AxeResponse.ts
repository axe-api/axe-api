import { ServerResponse } from "http";
import { ILanguage } from "src/Interfaces";

class AxeResponse {
  private response: ServerResponse;
  private responseStatus = false;
  private language: ILanguage;

  constructor(response: ServerResponse, language: ILanguage) {
    this.response = response;
    this.language = language;
  }

  get original() {
    return this.response;
  }

  json(data: object, statusCode = 200) {
    this.response.setHeader("Content-Type", "application/json");
    this.response.setHeader("Content-Language", this.language.language);
    this.response.statusCode = statusCode;
    this.response.write(JSON.stringify(data));
    this.response.end();
    this.responseStatus = true;
  }

  send(content: string, statusCode = 200) {
    this.response.statusCode = statusCode;
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
