import { Frameworks } from "../../Enums";
import { APIService } from "../../Services";
import { ExpressRequest } from "./ExpressRequest";

class RequestFactory {
  static get(req: any) {
    const api = APIService.getInstance();
    const frameworkName = api.config.framework;

    switch (frameworkName) {
      case Frameworks.Fastify:
        throw new Error("Burasi duzeltilecek.");
      case Frameworks.Express:
        return new ExpressRequest(req);
      default:
        throw new Error(`Undefined framework type: ${frameworkName}`);
    }
  }
}

export default RequestFactory;
