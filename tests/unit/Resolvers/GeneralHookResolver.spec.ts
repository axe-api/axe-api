import path from "path";
import { describe, test, expect, beforeEach } from "vitest";
import { GeneralHookResolver } from "../../../src/Resolvers";
import { App, IoCService } from "../../../src/Services";
import { IVersion } from "../../../src/Interfaces";
const directory = path.join(__dirname, "..", "__Mocks");

const FOLDERS_MOCK = {
  App: directory,
};

const version = {
  folders: {
    root: path.join(__dirname, "..", "__Mocks", "app"),
  },
} as IVersion;

describe("GeneralHookResolver", () => {
  beforeEach(() => {
    IoCService.singleton("Folders", () => FOLDERS_MOCK);
  });

  test(".resolve() should be able to resolve general hook functions", async () => {
    const result = await new GeneralHookResolver(version).resolve();
    expect(await result.onBeforeInit({} as App)).toBe("my-on-before-init-mock");
    expect(await result.onAfterInit({} as App)).toBe("my-on-after-init-mock");
  });
});
