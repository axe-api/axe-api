import URLService from "./URLService";

class App {
  public get(url: string, callback: any) {
    console.log("url");
  }

  public use(middleware: any) {
    URLService.addMiddleware(middleware);
  }
}

export default App;
