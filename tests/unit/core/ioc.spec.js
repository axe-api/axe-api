import IoC from "./../../../src/core/IoC";

describe("IoC", () => {
  test("should be able to bind simple dependency", async () => {
    const resolver = jest.fn(() => {
      return "resolved";
    });
    IoC.bind("Config", resolver);
    const result = await IoC.use("Config");
    expect(result).toBe("resolved");
    expect(resolver.mock.calls.length).toBe(1);
  });

  test("should be able to call twice simple bindings", async () => {
    const resolver = jest.fn();
    IoC.bind("Config", resolver);
    await IoC.use("Config");
    await IoC.use("Config");
    expect(resolver.mock.calls.length).toBe(2);
  });

  test("should be able to bing singleton", async () => {
    const resolver = jest.fn(() => {
      return "ConfigInstange";
    });
    IoC.singleton("Config", resolver);
    await IoC.use("Config");
    await IoC.use("Config");
    expect(resolver.mock.calls.length).toBe(1);
  });
});
