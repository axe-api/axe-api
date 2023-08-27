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

  /**
   * Get the `connect` instance
   *
   * @readonly
   * @memberof App
   */
  get instance() {
    return this.connect;
  }

  /**
   * Add a global connect middleware
   *
   * @param middleware
   * @example
   *  app.use((req: IncomingMessage, res: ServerResponse, next: any) => {
   *    next()
   *  })
   */
  public use(middleware: connect.NextHandleFunction) {
    this.connect.use(middleware);
    LogService.debug(`New middleware: ${middleware.name || "anonymous"}()`);
  }

  /**
   * Add a GET request handler with middleware support
   *
   * @param url
   * @param args
   * @example
   *  app.get(
   *    "/api/v1/health",
   *    myHandler,
   *    async (req: AxeRequest, res: AxeResponse) => {
   *      res.json({});
   *    }
   * );
   */
  public get(url: string, ...args: DynamicFunctionType) {
    const { handler, middlewares } = resolveMiddlewares(args);
    URLService.addHandler("GET", url, handler, middlewares);
  }

  /**
   * Add a POST request handler with middleware support
   *
   * @param url
   * @param args
   * @example
   *  app.post(
   *    "/api/v1/health",
   *    myHandler,
   *    async (req: AxeRequest, res: AxeResponse) => {
   *      res.json({});
   *    }
   * );
   */
  public post(url: string, ...args: DynamicFunctionType) {
    const { handler, middlewares } = resolveMiddlewares(args);
    URLService.addHandler("POST", url, handler, middlewares);
  }

  /**
   * Add a PUT request handler with middleware support
   *
   * @param url
   * @param args
   * @example
   *  app.put(
   *    "/api/v1/health",
   *    myHandler,
   *    async (req: AxeRequest, res: AxeResponse) => {
   *      res.json({});
   *    }
   * );
   */
  public put(url: string, ...args: DynamicFunctionType) {
    const { handler, middlewares } = resolveMiddlewares(args);
    URLService.addHandler("PUT", url, handler, middlewares);
  }

  /**
   * Add a PATCH request handler with middleware support
   *
   * @param url
   * @param args
   * @example
   *  app.patch(
   *    "/api/v1/health",
   *    myHandler,
   *    async (req: AxeRequest, res: AxeResponse) => {
   *      res.json({});
   *    }
   * );
   */
  public patch(url: string, ...args: DynamicFunctionType) {
    const { handler, middlewares } = resolveMiddlewares(args);
    URLService.addHandler("PATCH", url, handler, middlewares);
  }

  /**
   * Add a DELETE request handler with middleware support
   *
   * @param url
   * @param args
   * @example
   *  app.delete(
   *    "/api/v1/health",
   *    myHandler,
   *    async (req: AxeRequest, res: AxeResponse) => {
   *      res.json({});
   *    }
   * );
   */
  public delete(url: string, ...args: DynamicFunctionType) {
    const { handler, middlewares } = resolveMiddlewares(args);
    URLService.addHandler("DELETE", url, handler, middlewares);
  }
}

export default App;
