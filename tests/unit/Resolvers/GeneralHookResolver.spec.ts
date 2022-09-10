import path from "path";
import { Express } from "express";
import { describe, expect, test, beforeEach } from "@jest/globals";
import { GeneralHookResolver } from "../../../src/Resolvers";
import { IoCService } from "../../../src/Services";
const directory = path.join(__dirname, "..", "__Mocks");

const FOLDERS_MOCK = {
  App: directory,
};

describe("GeneralHookResolver", () => {
  beforeEach(() => {
    IoCService.singleton("Folders", () => FOLDERS_MOCK);
  });

  test(".resolve() should be able to resolve general hook functions", async () => {
    const result = await GeneralHookResolver.resolve();
    expect(await result.onBeforeInit({} as Express)).toBe(
      "my-on-before-init-mock"
    );
    expect(await result.onAfterInit({} as Express)).toBe(
      "my-on-after-init-mock"
    );
  });
});
