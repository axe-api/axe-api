import { HandlerFunction } from "../Types";
import URLService from "./URLService";

class App {
  public use(middleware: any) {
    URLService.addMiddleware(middleware);
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
