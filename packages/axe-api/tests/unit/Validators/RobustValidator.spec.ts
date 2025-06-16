import { describe, expect, test, beforeAll } from "vitest";
import RobustValidator from "../../../src/Validators/RobustValidator";
import Author from "../__Mocks/app/v1/Models/Author";
import {
  APIService,
  AxeRequest,
  LogService,
  ModelService,
} from "../../../src/Services";
import { IncomingMessage } from "connect";

describe("RobustValidator", () => {
  beforeAll(() => {
    // Setting some instances
    LogService.setInstance({});
    APIService.setInsance(__dirname);
  });

  test(".validate() should be able to validate the data properly", async () => {
    const validator = new RobustValidator(["en"]);
    // We should wait for the validation initialization.
    // It has to import language files
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Setting dummy data
    const axeRequest = new AxeRequest({} as IncomingMessage);
    const authorService = new ModelService("Author", new Author());
    const result = await validator.validate(axeRequest, authorService, {});
    expect(result).not.toBe(null);
    expect(Array.isArray(result?.errors.name)).toBe(true);
    expect(result?.errors.name[0]).toBe("The field is required.");
  });

  test(".validate() should be able to use different languages", async () => {
    const validator = new RobustValidator(["en", "tr"]);
    // We should wait for the validation initialization.
    // It has to import language files
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Setting dummy data
    const axeRequest = new AxeRequest({} as IncomingMessage);
    axeRequest.currentLanguage = {
      title: "tr",
      language: "tr",
      region: null,
    };
    const authorService = new ModelService("Author", new Author());
    const result = await validator.validate(axeRequest, authorService, {});
    expect(result).not.toBe(null);
    expect(Array.isArray(result?.errors.name)).toBe(true);
    expect(result?.errors.name[0]).toBe("Alan gereklidir.");
  });
});
