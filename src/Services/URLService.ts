import { promisify } from "util";
import {
  HandlerFunction,
  MiddlewareFunction,
  AxeFunction,
  NextFunction,
  PhaseFunction,
  GeneralFunction,
} from "../Types";
import { HANDLER_CYLES } from "../constants";
import {
  IModelService,
  IPhaseDefinition,
  IContext,
  IRouteData,
  IVersion,
  IURLPair,
} from "../Interfaces";
import AxeRequest from "./AxeRequest";
import { TransactionResolver } from "../Resolvers";
import { HandlerTypes } from "../Enums";
import LogService from "./LogService";
import { isMiddlewareFunction, toPhaseFunction } from "./ConverterService";

const check = (url: string, pattern: string) => {
  // Escape special characters in the pattern and replace parameter placeholders with regular expression groups
  const regexPattern = new RegExp(
    "^" + pattern.replace(/:[a-zA-Z0-9_]+/g, "([a-zA-Z0-9_-]+)") + "$"
  );

  // Test if the URL matches the pattern
  const match = url.match(regexPattern);

  if (match) {
    // Extract parameter values from the URL
    const params: any = {};
    const paramNames = pattern.match(/:[a-zA-Z0-9_]+/g) || [];
    paramNames.forEach((param, index) => {
      const paramName = param.slice(1); // Remove the leading ":"
      params[paramName] = match[index + 1]; // index + 1 because match[0] is the whole matched string
    });
    return params;
  }

  return null; // URL does not match the pattern
};

class URLService {
  private static urls: IURLPair[] = [];

  static async add(
    method: string,
    pattern: string,
    data: IRouteData,
    middlewares: AxeFunction[]
  ) {
    const phases = this.getDefaultPhases(middlewares);

    if (data.handlerType && data.model) {
      for (const cycle of HANDLER_CYLES[data.handlerType]) {
        const item = cycle.get(data.model);
        if (item) {
          phases.push({
            name: cycle.name,
            isAsync: cycle.isAsync(),
            callback: item,
          });
        }
      }
    }

    let hasTransaction = false;

    if (data.version && data.model && data.handlerType) {
      hasTransaction = await new TransactionResolver(data.version).resolve(
        data.model,
        data.handlerType
      );
    }

    LogService.info(`${method} ${pattern}`);

    this.urls.push({
      method,
      pattern,
      data,
      phases,
      hasTransaction,
    });
  }

  static async addHandler(
    method: string,
    pattern: string,
    customHandler: HandlerFunction,
    middlewares: GeneralFunction[]
  ) {
    LogService.info(`${method} ${pattern}`);

    const phases = middlewares.map((middleware) => {
      return {
        isAsync: false,
        name: `middleware:test`,
        callback: async (context: IContext) => {
          if (isMiddlewareFunction(middleware)) {
            // It should be wrapped
            const caller = promisify((context: IContext, next: NextFunction) =>
              (middleware as MiddlewareFunction)(
                context.req.original,
                context.res.original,
                next
              )
            );
            await caller(context);
          } else {
            // We call it directly.
            await (middleware as HandlerFunction)(context.req, context.res);
          }
        },
      };
    });

    const hasTransaction = false;

    phases.push({
      isAsync: false,
      name: "customHandler",
      callback: async (context: IContext) => {
        customHandler(context.req, context.res);
      },
    });

    this.urls.push({
      method,
      pattern,
      phases,
      hasTransaction,
      customHandler,
      data: {
        version: {} as IVersion,
        handlerType: HandlerTypes.INSERT,
        model: {} as IModelService,
        parentModel: null,
        relation: null,
      },
    });
  }

  static match(request: AxeRequest) {
    if (!request) {
      return undefined;
    }

    for (const item of URLService.urls) {
      const found =
        item.method === request.method &&
        check(request.url.pathname, item.pattern);

      if (found) {
        return {
          ...item,
          params: found,
        };
      }
    }
  }

  static getAllURLs() {
    return this.urls;
  }

  private static getDefaultPhases(
    middlewares: AxeFunction[]
  ): IPhaseDefinition[] {
    // We should convert to all AxeFunction functions to PhaseFunctions
    const callbacks: PhaseFunction[] = middlewares.map(toPhaseFunction);

    const phases: IPhaseDefinition[] = [
      // Internal middlewares
      ...callbacks.map((callback: PhaseFunction) => {
        return {
          isAsync: true,
          name: `middleware:${callback.name || "anonymous"}`,
          callback,
        };
      }),
    ];

    return phases;
  }
}

export default URLService;
