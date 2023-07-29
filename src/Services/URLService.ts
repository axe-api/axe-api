import { IRouteData } from "../Interfaces";

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
}

class URLService {
  private urls: Pair[];
  constructor() {
    this.urls = [];
  }

  add(method: string, pattern: string, data: IRouteData) {
    this.urls.push({
      method,
      pattern,
      data,
    });
  }

  match(method: string | undefined, url: string | undefined) {
    if (!method || !url) {
      return undefined;
    }

    const item = this.urls.find(
      (item) => item.method === method && check(url, item.pattern)
    );

    if (item) {
      const params = check(url, item.pattern);
      return {
        ...item,
        params,
      };
    }
  }
}

export default URLService;
