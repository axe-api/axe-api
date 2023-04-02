import { ILanguage } from "../../Interfaces";

class BaseRequest {
  public currentLanguage: ILanguage;

  constructor() {
    this.currentLanguage = {
      title: "en",
      language: "en",
      region: "en",
    };
  }
}

export default BaseRequest;
