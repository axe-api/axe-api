/* eslint-disable no-undef */
import axios from "axios";

jest.useRealTimers();

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.headers.post["Content-Type"] = "application/json";

describe("Multiple version support", () => {
  test("adding new feature for the new version", async () => {
    try {
      await axios.get("/v1/customers/all");
      expect(true).toBe(false, "This endpoint should not support ALL");
    } catch (error) {
      expect(true).toBe(true);
    }

    try {
      await axios.get("/v2/customers/all");
    } catch (error) {
      expect(true).toBe(false, "This endpoint should support ALL");
    }
  });

  test("limiting query features", async () => {
    // The following requests should work fine
    await axios.get("/v1/customers?sort=name");
    await axios.get("/v2/customers?sort=id");

    try {
      // We denied to use sorting feature for V2
      await axios.get("/v2/customers?sort=name");
      expect(true).toBe(false, "Sorting feature should not be supported.");
    } catch (error) {
      expect(error.response.data.error).toBe(
        "Unsupported query feature: sorting [soft_delete_1.name]"
      );
    }
  });
});
