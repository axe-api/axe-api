import connect from "connect";
import bodyParser from "body-parser";
import { DynamicFunctionType } from "../Types";
import URLService from "./URLService";
import LogService from "./LogService";
import RateLimitMiddleware, {
  setupRateLimitAdaptors,
} from "../Middlewares/RateLimit";
import APIService from "./APIService";
import { resolveMiddlewares } from "./ConverterService";

class App {
  private connect: connect.Server;

  constructor() {
    this.connect = connect();
    LogService.debug("Created a new connect() instance");
    this.connect.use(bodyParser.urlencoded({ extended: true }));
    this.connect.use(bodyParser.json());
    LogService.debug("New middleware: bodyParser()");

    // Activate the Rate Limit middleware
    const api = APIService.getInstance();
    setupRateLimitAdaptors(api.config);

    if (api.config.rateLimit?.enabled) {
      LogService.debug("New middleware: rateLimit()");
      this.connect.use(RateLimitMiddleware);
    }
  }

  get instance() {
    return this.connect;
  }

  public use(middleware: connect.NextHandleFunction) {
    this.connect.use(middleware);
    LogService.debug(`New middleware: ${middleware.name || "anonymous"}()`);
  }

  public get(url: string, ...args: DynamicFunctionType) {
    const { handler, middlewares } = resolveMiddlewares(args);
    URLService.addHandler("GET", url, handler, middlewares);
  }

  public post(url: string, ...args: DynamicFunctionType) {
    const { handler, middlewares } = resolveMiddlewares(args);
    URLService.addHandler("POST", url, handler, middlewares);
  }

  public put(url: string, ...args: DynamicFunctionType) {
    const { handler, middlewares } = resolveMiddlewares(args);
    URLService.addHandler("PUT", url, handler, middlewares);
  }

  public patch(url: string, ...args: DynamicFunctionType) {
    const { handler, middlewares } = resolveMiddlewares(args);
    URLService.addHandler("PATCH", url, handler, middlewares);
  }

  public delete(url: string, ...args: DynamicFunctionType) {
    const { handler, middlewares } = resolveMiddlewares(args);
    URLService.addHandler("DELETE", url, handler, middlewares);
  }
}

export default App;
