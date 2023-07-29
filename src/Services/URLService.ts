import { PhaseFunction } from "src/Types";
import { HANDLER_CYLES } from "../constants";
import { IPhaseDefinition, IRouteData } from "../Interfaces";
import AxeRequest from "./AxeRequest";
import { TransactionResolver } from "../Resolvers";

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

interface Pair {
  method: string;
  pattern: string;
  data: IRouteData;
  phases: IPhaseDefinition[];
  hasTransaction: boolean;
  params?: any;
}

class URLService {
  private urls: Pair[];
  constructor() {
    this.urls = [];
  }

  async add(
    method: string,
    pattern: string,
    data: IRouteData,
    middlewares: PhaseFunction[]
  ) {
    const phases: IPhaseDefinition[] = [
      ...middlewares.map((middleware) => {
        return {
          isAsync: true,
          callback: middleware,
        };
      }),
    ];

    for (const cycle of HANDLER_CYLES[data.handlerType]) {
      const item = cycle.get(data.model);
      if (item) {
        phases.push({
          isAsync: cycle.isAsync(),
          callback: item,
        });
      }
    }

    const hasTransaction = await new TransactionResolver(data.version).resolve(
      data.model,
      data.handlerType
    );

    this.urls.push({
      method,
      pattern,
      data,
      phases,
      hasTransaction,
    });
  }

  match(request: AxeRequest) {
    if (!request) {
      return undefined;
    }

    for (const item of this.urls) {
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
}

export default URLService;
