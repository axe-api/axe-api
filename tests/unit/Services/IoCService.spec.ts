import { describe, expect, test } from "@jest/globals";
import { IoCService } from "../../../src/Services";
import User from "../__Mocks/app/v1/Models/User";

const waitForIt = async (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

describe("IoCService", () => {
  test(".bind() should be able to create new instance for each time", async () => {
    IoCService.bind("my-class", () => Date.now());
    const first = await IoCService.use("my-class");
    await waitForIt(5);
    const second = await IoCService.use("my-class");
    expect(first).toBeLessThan(second);
  });

  test(".singleton() should be able to get the same instance all the time", async () => {
    IoCService.singleton("my-class", () => Date.now());
    const first = await IoCService.use("my-class");
    await waitForIt(5);
    const second = await IoCService.use("my-class");
    expect(first).toBe(second);
  });

  test(".useByType() should be able return the dependency with a type", async () => {
    IoCService.singleton("UserModel", () => new User());
    const instance = await IoCService.useByType<User>("UserModel");
    expect(instance.constructor.name).toBe("User");
    expect(instance.table).toBe("users");
  });
});
