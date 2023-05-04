import { get, post, put, patch, deleteIt, truncate } from "./helper.js";
import axios from "axios";
import dotenv from "dotenv";
let userId = null;

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.headers.post["Content-Type"] = "application/json";

describe('Test GET /api/items/:id endpoint', () => {
    beforeAll(async () => {
        dotenv.config();
        return await truncate("users");
      });
    
      afterAll(async () => {
       return await truncate("users");
      });

  test('should return 404 error if item is not found', async () => {
    const item = await axios.get(`/api/v1/users/${userId}`);
    expect(item.status).toBe(404);
  });
});
