import { IncomingMessage } from "http";
import { ILanguage } from "src/Interfaces";

class AxeRequest {
  private request: IncomingMessage;
  private language: ILanguage;
  private urlObject: URL;

  constructor(request: IncomingMessage) {
    this.request = request;
    this.urlObject = new URL(request.url || "", "http://127.0.0.1");
    this.language = {
      title: "en",
      language: "en",
      region: null,
    };
  }

  get url() {
    return this.urlObject;
  }

  get query() {
    return this.urlObject.searchParams;
  }

  get path() {
    // TODO: Path
    return this.request.url || "";
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
