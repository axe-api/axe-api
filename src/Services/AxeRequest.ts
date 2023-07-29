import { IncomingMessage } from "http";
import { ILanguage } from "src/Interfaces";

class AxeRequest {
  private request: IncomingMessage;
  private language: ILanguage;

  constructor(request: IncomingMessage) {
    this.request = request;
    this.language = {
      title: "en",
      language: "en",
      region: null,
    };
  }

  get query() {
    return "";
  }

  get path() {
    // TODO: Path
    return this.request.url || "";
  }

  get params(): Record<string, any> {
    return {};
  }

  get method() {
    return this.request.method || "GET";
  }

  get body(): any {
    return {};
  }

  get currentLanguage() {
    return this.language;
  }

  set currentLanguage(language: ILanguage) {
    this.language = language;
  }

  header(key: string) {
    return this.request.headers[key];
  }
}

export default AxeRequest;
