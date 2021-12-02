import { get, post, put, deleteIt, truncate } from "./helper.js";
import dotenv from "dotenv";
let userId = null;

describe("Axe API", () => {
  beforeAll(async () => {
    dotenv.config();
    return await truncate("users");
  });

  afterAll(async () => {
    return await truncate("users");
  });

  test("should be able to accept requests", async () => {
    const { body } = await get({ url: "/", status: 200 });
    expect(body.name).toBe("AXE API");
  });

  test("should be able to get user list as empty", async () => {
    const { body } = await get({ url: "/api/users", status: 200 });
    expect(body.data.length).toBe(0);
    expect(body.pagination.total).toBe(0);
  });

  test("should be able to create a new user", async () => {
    const data = {
      email: "foo@bar.com",
      name: "John",
      surname: "Doe",
    };
    const { body } = await post({ url: "/api/users", data, status: 200 });
    userId = body.id;
    expect(body.email).toBe("foo@bar.com");
    expect(body.created_at).not.toBeNull();
    expect(body.fullname).toBe("John Doe");
  });

  test("should be able to paginate users", async () => {
    const { body } = await get({ url: "/api/users", status: 200 });
    expect(body.data.length).toBe(1);
    expect(body.pagination.total).toBe(1);
  });

  test("should be able to fetch one user", async () => {
    const { body } = await get({ url: `/api/users/${userId}`, status: 200 });
    expect(body.email).toBe("foo@bar.com");
    expect(body.created_at).not.toBeNull();
    expect(body.fullname).toBe("John Doe");
    expect(body.password_salt).toBe(undefined);
    expect(body.password_hash).toBe(undefined);
  });

  test("should be able to update the user by id", async () => {
    const data = {
      name: "Karl",
      surname: "Popper",
    };
    const { body } = await put({
      url: `/api/users/${userId}`,
      data,
      status: 200,
    });
    expect(body.email).toBe("foo@bar.com");
    expect(body.created_at).not.toBeNull();
    expect(body.fullname).toBe("Karl Popper");
  });

  test("should be able to update the user with autosave by id", async () => {
    const data = {
      name: "Karl",
    };
    const { body } = await put({
      url: `/api/users/${userId}/autosave`,
      data,
      status: 200,
    });
    expect(body.email).toBe("foo@bar.com");
    expect(body.fullname).toBe("Karl Popper");
  });

  test("should be able to delete the user by id", async () => {
    await deleteIt({ url: `/api/users/${userId}`, status: 200 });
  });

  test("should be able to result users as empty after the delation", async () => {
    const { body } = await get({ url: "/api/users", status: 200 });
    expect(body.data.length).toBe(0);
    expect(body.pagination.total).toBe(0);
  });
});
