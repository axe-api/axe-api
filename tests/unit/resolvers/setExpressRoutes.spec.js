import IoC from "../../../src/core/IoC";

const bindConfig = async (prefix) => {
  const Config = {
    Application: {
      prefix,
    },
  };
  await IoC.bind("Config", async () => Config);
};

const getResult = async () => {
  const { getRootPrefix } = await import(
    "./../../../src/resolvers/setExpressRoutes"
  );
  return await getRootPrefix();
};

describe("getRootPrefix", () => {
  test("should be able clear slashes", async () => {
    await bindConfig("/api/");
    expect(await getResult()).toBe("api");

    await bindConfig("/api");
    expect(await getResult()).toBe("api");

    await bindConfig("api");
    expect(await getResult()).toBe("api");

    await bindConfig("/v1/api/");
    expect(await getResult()).toBe("v1/api");

    await bindConfig("v1/api");
    expect(await getResult()).toBe("v1/api");
  });
});
