import { ServerResponse } from "http";
import { StatusCodes } from "src/Enums";
import { ILanguage } from "src/Interfaces";

class AxeResponse {
  private response: ServerResponse;
  private language: ILanguage;

  constructor(response: ServerResponse, language: ILanguage) {
    this.response = response;
    this.response.statusCode = 200;
    this.language = language;
  }

  /**
   * Get the original `ServerResponse` value
   *
   * @readonly
   * @memberof AxeResponse
   */
  get original() {
    return this.response;
  }

  /**
   * Set the HTTP Response Status Code
   *
   * @param statusCode
   * @returns
   */
  status(statusCode: StatusCodes) {
    this.response.statusCode = statusCode;
    return this;
  }

  /**
   * Set the HTTP Response Data as JSON
   *
   * @param data
   */
  json(data: object) {
    this.response.setHeader("Content-Type", "application/json");
    this.response.setHeader("Content-Language", this.language.language);
    this.response.write(JSON.stringify(data));
    this.response.end();
    this.response.isResponded = true;
  }

  /**
   * Set the HTTP Response Data as string
   *
   * @param data
   */
  send(content: string) {
    this.response.write(content);
    this.response.end();
    this.response.isResponded = true;
  }

  /**
   * Set the no-content to the HTTP Response with 204 status code.
   */
  noContent() {
    this.response.statusCode = 204;
    this.response.end();
    this.response.isResponded = true;
  }

  isResponded(): boolean {
    return !!this.response.isResponded;
  }

  statusCode() {
    return this.response.statusCode;
  }

  header(key: string, value: string) {
    this.original.setHeader(key, value);
  }
}

export default AxeResponse;
