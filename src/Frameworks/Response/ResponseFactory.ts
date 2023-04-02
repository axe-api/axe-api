import { Frameworks } from "../../Enums";
import { IResponse } from "../../Interfaces";
import { APIService } from "../../Services";
import ExpressResponse from "./ExpressResponse";

class ResponseFactory {
  static get(response: any): IResponse {
    const api = APIService.getInstance();
    const frameworkName = api.config.framework;

    switch (frameworkName) {
      case Frameworks.Fastify:
        throw new Error("Burasi duzeltilecek.");
      case Frameworks.Express:
        return new ExpressResponse(response);
      default:
        throw new Error(`Undefined framework type: ${frameworkName}`);
    }
  }
}

export default ResponseFactory;
