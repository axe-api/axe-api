import { describe, test, expect } from "vitest";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.headers.post["Content-Type"] = "application/json";

describe("URL Name", () => {
  test("should be able to created as param-case", async () => {
    const { status } = await axios.get("/v1/exam-lesson-defaults");
    expect(status).toBe(200);
  });
});
