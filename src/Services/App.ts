import connect from "connect";
import bodyParser from "body-parser";
import { HandlerFunction } from "../Types";
import URLService from "./URLService";

class App {
  private connect: connect.Server;

  constructor() {
    this.connect = connect();
    this.connect.use(bodyParser.urlencoded({ extended: true }));
    this.connect.use(bodyParser.json());
  }

  get instance() {
    return this.connect;
  }

  public use(middleware: connect.NextHandleFunction) {
    this.connect.use(middleware);
  }

  public get(url: string, handler: HandlerFunction) {
    URLService.addHandler("GET", url, handler);
  }

  public post(url: string, handler: HandlerFunction) {
    URLService.addHandler("POST", url, handler);
  }

  public put(url: string, handler: HandlerFunction) {
    URLService.addHandler("PUT", url, handler);
  }

  public patch(url: string, handler: HandlerFunction) {
    URLService.addHandler("PATCH", url, handler);
  }

  public delete(url: string, handler: HandlerFunction) {
    URLService.addHandler("DELETE", url, handler);
  }
}

export default App;
