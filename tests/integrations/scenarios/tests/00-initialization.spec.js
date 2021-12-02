import { get } from "./helper.js";

describe("Axe API", () => {
  test("should be able call the onBeforeInit functions", async () => {
    const { body } = await get({ url: "/health/v1", status: 200 });
    expect(body.health).toBe(true);
  });

  test("should be able call the onAfterInit functions", async () => {
    const { body } = await get({ url: "/health/v2", status: 200 });
    expect(body.health).toBe(true);
  });
});
