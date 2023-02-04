/* eslint-disable no-undef */
import { get } from "./helper.js";

describe("Axe API", () => {
  test("should be able call the onBeforeInit functions", async () => {
    const { body } = await get({ url: "/health/before", status: 200 });
    expect(body.health).toBe(true);
  });

  test("should be able call the onAfterInit functions", async () => {
    const { body } = await get({ url: "/health/after", status: 200 });
    expect(body.health).toBe(true);
  });
});
