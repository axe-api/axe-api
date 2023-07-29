import { ServerResponse } from "http";

class AxeResponse {
  private response: ServerResponse;
  private responseStatus = false;

  constructor(response: ServerResponse) {
    this.response = response;
  }

  json(data: object, statusCode = 200) {
    this.response.statusCode = statusCode;
    this.response.write(JSON.stringify(data));
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
