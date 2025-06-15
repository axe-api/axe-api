import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { post, truncate } from "./helper.js";
import axios from "axios";
let userId = null;

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.headers.post["Content-Type"] = "application/json";

describe("Hooks", () => {
  beforeAll(async () => {
    return await truncate("users");
  });

  afterAll(async () => {
    return await truncate("users");
  });

  test("should be able call PATCH hooks correctly", async () => {
    const data = {
      email: "foo@bar.com",
      name: "John",
      surname: "Doe",
    };
    const { body } = await post({ url: "/api/v1/users", data, status: 201 });
    userId = body.id;

    const response = await axios.patch(`/v1/users/${userId}`, {
      name: "New name",
    });
    expect(response.headers["x-custom-hook"]).toBe("onBeforePatchQuery");
  });
});
