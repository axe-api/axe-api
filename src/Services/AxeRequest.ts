import { IncomingMessage } from "http";

class AxeRequest {
  private request: IncomingMessage;

  constructor(request: IncomingMessage) {
    this.request = request;
  }

  get query() {
    return "";
  }

  get params(): Record<string, any> {
    return {};
  }

  get method() {
    return this.request.method || "GET";
  }

  get body() {
    return {};
  }

  get currentLanguage() {
    return {
      title: "en",
      language: "en",
      region: null,
    };
  }
}

export default AxeRequest;
