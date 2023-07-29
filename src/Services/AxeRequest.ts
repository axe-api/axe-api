import { IncomingMessage } from "http";
import { ILanguage } from "src/Interfaces";

class AxeRequest {
  private request: IncomingMessage;
  private language: ILanguage;
  private urlObject: URL;
  private parsedBody: Record<string, any> = {};
  private privateParams: any = {};

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

  get params() {
    return this.privateParams;
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

  get body() {
    return this.parsedBody;
  }

  async prepare(params: any) {
    this.privateParams = params;

    if (this.request.method !== "POST" && this.request.method !== "PUT") {
      return;
    }

    return new Promise<void>((resolve, cancel) => {
      let body = "";
      this.request.on("data", (chunk) => {
        body += chunk.toString();
      });

      this.request.on("end", () => {
        try {
          this.parsedBody = JSON.parse(body);
          resolve();
        } catch (error) {
          cancel(error);
        }
      });
    });
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
