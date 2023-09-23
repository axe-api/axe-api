/* eslint-disable no-undef */
import axios from "axios";
import dotenv from "dotenv";
import { truncate } from "./helper.js";

jest.useRealTimers();

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.headers.post["Content-Type"] = "application/json";

describe("Cache", () => {
  beforeAll(async () => {
    dotenv.config();
    await truncate("role_permissions");
    return await truncate("roles");
  });

  test("should be able to see cached results", async () => {
    // Create a new role
    const { data: role } = await axios.post("/v2/roles", {
      title: "Admin",
    });
    expect(role.title).toBe("Admin");

    // Create a new permission under the role
    const { data: permission } = await axios.post(
      `/v2/roles/${role.id}/permissions`,
      {
        title: "Creating user",
      },
    );
    expect(permission.title).toBe("Creating user");

    // Fetch the roles with permissions
    const response1 = await axios.get("/v2/roles?with=permissions");
    expect(response1.status).toBe(200);
    expect(response1.headers["x-axe-api-cache"]).toBe("Missed");

    // Fetch the roles with permissions AGAIN and check if the HIT cache
    const response2 = await axios.get("/v2/roles?with=permissions");
    expect(response2.status).toBe(200);
    expect(response2.headers["x-axe-api-cache"]).toBe("Hit");

    // Patch the permission
    const { data: permissionPatch } = await axios.patch(
      `/v2/roles/${role.id}/permissions/${permission.id}`,
      {
        title: "Creating user - 1",
      },
    );
    expect(permissionPatch.title).toBe("Creating user - 1");

    // Fetch the roles with permissions AGAIN. It should be missed because we
    // updated the permission value. The cached value should be deleted
    const response3 = await axios.get("/v2/roles?with=permissions");
    expect(response3.status).toBe(200);
    expect(response3.headers["x-axe-api-cache"]).toBe("Missed");

    // Then we should be able to see the HIT again
    const response4 = await axios.get("/v2/roles?with=permissions");
    expect(response4.status).toBe(200);
    expect(response4.headers["x-axe-api-cache"]).toBe("Hit");

    // Wait for the 4000 second due to stale
    await new Promise((resolve) => setTimeout(resolve, 4000));

    // WE should be able to see the stale
    const response5 = await axios.get("/v2/roles?with=permissions");
    expect(response5.status).toBe(200);
    expect(response5.headers["x-axe-api-cache"]).toBe("Missed");
  });
});
