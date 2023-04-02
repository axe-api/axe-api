/* eslint-disable no-case-declarations */
import { APIService } from "../../Services";
import { IFramework } from "../../Interfaces";
import { Frameworks } from "../../Enums";
import ExpressFramework from "./ExpressFramework";
import FastifyFramework from "./FastifyFramework";

class AdapterFactory {
  static async get(): Promise<IFramework> {
    const api = APIService.getInstance();
    const frameworkName = api.config.framework;
    let framework: IFramework | null = null;

    switch (frameworkName) {
      case Frameworks.Fastify:
        framework = new FastifyFramework();
        break;
      case Frameworks.Express:
        framework = new ExpressFramework();
        break;
    }

    if (!framework) {
      throw new Error(`Undefined framework type: ${frameworkName}`);
    }

    await framework.init();
    return framework;
  }
}

export default AdapterFactory;
