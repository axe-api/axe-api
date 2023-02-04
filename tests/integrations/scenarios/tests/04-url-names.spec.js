/* eslint-disable no-undef */
import axios from "axios";
import dotenv from "dotenv";

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.headers.post["Content-Type"] = "application/json";

describe("URL Name", () => {
  beforeAll(async () => {
    dotenv.config();
  });

  test("should be able to created as param-case", async () => {
    const { status } = await axios.get("/v1/exam-lesson-defaults");
    expect(status).toBe(200);
  });
});
