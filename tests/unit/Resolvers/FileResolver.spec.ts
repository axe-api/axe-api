import path from "path";
import { describe, expect, test } from "@jest/globals";
import { FileResolver } from "../../../src/Resolvers";
import Model from "../../../src/Model";

const directory = path.join(__dirname, "..", "__Mocks", "app", "v1", "Models");

describe("FileResolver", () => {
  test(".resolve() should be able to resolve models by the directory", async () => {
    const resolver = new FileResolver();
    const items: Record<string, Model> = await resolver.resolve<Model>(
      directory
    );
    expect(Object.keys(items).length).toBe(6);
    expect((items["User"].fillable as []).length).toBe(2);
  });

  test(".resolveContent() should be able to get the content by the directory", async () => {
    const resolver = new FileResolver();
    const items: Record<string, Model> = await resolver.resolveContent(
      directory
    );
    expect(Object.keys(items).length).toBe(6);
    expect(typeof (items["User"] as any).default).toBe("function");
  });

  test(".resolve() should be able to get empty array when the directory is not exists", async () => {
    const resolver = new FileResolver();
    const items: Record<string, Model> = await resolver.resolve(
      path.join(__dirname, "..", "undefined-directory")
    );
    expect(Object.keys(items).length).toBe(0);
  });

  test(".resolveContent() should be able to get empty array when the directory is not exists", async () => {
    const resolver = new FileResolver();
    const items: Record<string, Model> = await resolver.resolveContent(
      path.join(__dirname, "..", "undefined-directory")
    );
    expect(Object.keys(items).length).toBe(0);
  });
});
