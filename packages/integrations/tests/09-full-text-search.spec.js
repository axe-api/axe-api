import { describe, test, expect, beforeAll, afterAll, vi } from "vitest";
import { truncate } from "./helper.js";
import axios from "axios";

vi.isFakeTimers();
vi.setConfig({ testTimeout: 10000 }); // 10 seconds

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.get["Content-Type"] = "application/json";

describe("Axe API Full-text search", () => {
  beforeAll(async () => {
    return await truncate("categories");
  });

  afterAll(async () => {
    return await truncate("categories");
  });

  test("should search via Elasticsearch", async () => {
    const { data: result1 } = await axios.post("/v1/categories", {
      title: "Testable category title",
    });

    expect(result1.title).toBe("Testable category title");

    // wait for index completed.
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const { data: result2 } = await axios.get(
      "/v1/categories/search?text=category"
    );
    expect(result2.data.length).toBe(1);
    expect(result2.data[0].title).toBe("Testable category title");
  });
});
