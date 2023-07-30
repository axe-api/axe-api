class App {
  public get(url: string, callback: any) {
    console.log("url");
  }

  public use(callback: any) {
    console.log("callback", callback);
  }
}

export default App;
