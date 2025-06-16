import connect, {
  HandleFunction,
  NextHandleFunction,
  ErrorHandleFunction,
} from "connect";
import bodyParser from "body-parser";
import { GeneralFunction } from "../Types";
import URLService from "./URLService";
import LogService from "./LogService";
import { setupRateLimitAdaptors } from "../Middlewares/RateLimit";
import APIService from "./APIService";
import { resolveMiddlewares } from "./ConverterService";
import DocumentationService from "./DocumentationService";
import { HttpMethods } from "../Enums";

class App {
  private connect: connect.Server;
  private docs: DocumentationService;

  constructor() {
    this.docs = DocumentationService.getInstance();
    this.connect = connect();
    LogService.debug("Created a new connect() instance");
    this.connect.use(bodyParser.urlencoded({ extended: true }));
    this.connect.use(bodyParser.json());
    LogService.debug("New middleware: bodyParser()");

    // Activate the Rate Limit middleware
    const api = APIService.getInstance();
    setupRateLimitAdaptors(api.config);
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
  public use(middleware: NextHandleFunction): void;
  public use(middleware: HandleFunction): void;
  public use(middleware: ErrorHandleFunction): void;
  public use(middleware: any) {
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
  public get(url: string, ...args: GeneralFunction[]) {
    const { handler, middlewares } = resolveMiddlewares(args);
    URLService.addHandler("GET", url, handler, middlewares);
    this.docs.pushCustom(HttpMethods.GET, url);
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
  public post(url: string, ...args: GeneralFunction[]) {
    const { handler, middlewares } = resolveMiddlewares(args);
    URLService.addHandler("POST", url, handler, middlewares);
    this.docs.pushCustom(HttpMethods.POST, url);
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
  public put(url: string, ...args: GeneralFunction[]) {
    const { handler, middlewares } = resolveMiddlewares(args);
    URLService.addHandler("PUT", url, handler, middlewares);
    this.docs.pushCustom(HttpMethods.PUT, url);
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
  public patch(url: string, ...args: GeneralFunction[]) {
    const { handler, middlewares } = resolveMiddlewares(args);
    URLService.addHandler("PATCH", url, handler, middlewares);
    this.docs.pushCustom(HttpMethods.PATCH, url);
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
  public delete(url: string, ...args: GeneralFunction[]) {
    const { handler, middlewares } = resolveMiddlewares(args);
    URLService.addHandler("DELETE", url, handler, middlewares);
    this.docs.pushCustom(HttpMethods.DELETE, url);
  }
}

export default App;
