import path from "path";
import { describe, expect, test, beforeEach } from "@jest/globals";
import { FolderResolver } from "../../../src/Resolvers";

describe("FolderResolver", () => {
  beforeEach(() => {});

  test(".resolve() should be able to return application directory map", async () => {
    const map = new FolderResolver().resolve("root-folder");
    expect(map.Config.split(path.sep)[2]).toBe("Config");
    expect(map.Events.split(path.sep)[2]).toBe("Events");
    expect(map.Hooks.split(path.sep)[2]).toBe("Hooks");
    expect(map.Middlewares.split(path.sep)[2]).toBe("Middlewares");
    expect(map.Models.split(path.sep)[2]).toBe("Models");
  });
});
