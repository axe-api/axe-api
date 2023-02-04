/* eslint-disable no-undef */
import { get, post, put, patch, deleteIt, truncate } from "./helper.js";
import axios from "axios";
import dotenv from "dotenv";
let userId = null;

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.headers.post["Content-Type"] = "application/json";

describe("Axe API", () => {
  beforeAll(async () => {
    dotenv.config();
    return await truncate("users");
  });

  afterAll(async () => {
    return await truncate("users");
  });

  test("should be able to get user list as empty", async () => {
    const { body } = await get({ url: "/api/v1/users", status: 200 });
    expect(body.data.length).toBe(0);
    expect(body.pagination.total).toBe(0);
  });

  test("should be able to create a new user", async () => {
    const data = {
      email: "foo@bar.com",
      name: "John",
      surname: "Doe",
    };
    const { body } = await post({ url: "/api/v1/users", data, status: 200 });
    userId = body.id;
    expect(body.email).toBe("foo@bar.com");
    expect(body.created_at).not.toBeNull();
    expect(body.fullname).toBe("John Doe");
  });

  test("should be able to paginate users", async () => {
    const { body } = await get({ url: "/api/v1/users", status: 200 });
    expect(body.data.length).toBe(1);
    expect(body.pagination.total).toBe(1);
  });

  test("should be able to fetch one user", async () => {
    const { body } = await get({ url: `/api/v1/users/${userId}`, status: 200 });
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
      url: `/api/v1/users/${userId}`,
      data,
      status: 200,
    });
    expect(body.email).toBe("foo@bar.com");
    expect(body.created_at).not.toBeNull();
    expect(body.fullname).toBe("Karl Popper");
  });

  test("should be able to update the user with patch by id", async () => {
    const data = {
      name: "Karl",
    };
    const { body } = await patch({
      url: `/api/v1/users/${userId}`,
      data,
      status: 200,
    });
    expect(body.email).toBe("foo@bar.com");
    expect(body.fullname).toBe("Karl Popper");
  });

  test("should be able to delete the user by id", async () => {
    await deleteIt({ url: `/api/v1/users/${userId}`, status: 200 });
  });

  test("should be able to result users as empty after the delation", async () => {
    const { body } = await get({ url: "/api/v1/users", status: 200 });
    expect(body.data.length).toBe(0);
    expect(body.pagination.total).toBe(0);
  });

  test("should be able to query items when the query field is not the field list", async () => {
    const data = {
      email: `foo1@bar.com`,
      name: "John",
      surname: "Doe",
    };
    await post({ url: "/api/v1/users", data, status: 200 });

    const { data: response } = await axios.get(`/v1/users`, {
      params: {
        q: JSON.stringify([
          {
            name: "John",
          },
        ]),
        fields: "email,surname",
        page: 1,
        per_page: 300,
      },
    });
    expect(response.pagination.total).toBe(1);
  });

  test("should be able to return form validation messages in German", async () => {
    let validationError = false;
    try {
      await axios.post(
        "/v1/users",
        {},
        {
          headers: {
            "Accept-Language": "de;q=0.9, en;q=0.8",
          },
        }
      );
    } catch (error) {
      validationError = true;
      expect(error?.response?.data?.errors?.email).not.toBe(undefined);
      expect(error.response.data.errors.email.length).toBe(1);
      expect(error.response.data.errors.email[0]).toBe(
        "Das email Feld muss ausgefüllt sein."
      );
      expect(error.response.headers["content-language"]).toBe("de");
    }

    expect(validationError).toBe(true);
  });
});
