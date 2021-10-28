import axios from "axios";
import dotenv from "dotenv";

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.headers.post["Content-Type"] = "application/json";

describe("URL Name", () => {
  beforeAll(async () => {
    dotenv.config();
  });

  afterAll(async () => {});

  test("should be able to created as param-case", async () => {
    const { status } = await axios.get("/exam-lesson-defaults");
    expect(status).toBe(200);
  });
});
