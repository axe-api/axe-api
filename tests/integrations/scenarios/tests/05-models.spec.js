/* eslint-disable no-undef */
import axios from "axios";
import dotenv from "dotenv";
import { truncate, axiosPost, axiosPut, axiosGet } from "./helper.js";

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.headers.post["Content-Type"] = "application/json";

describe("Axe API Models", () => {
  beforeAll(async () => {
    dotenv.config();
    await truncate("users");
    await truncate("categories");
    return await truncate("units");
  });

  afterAll(async () => {
    await truncate("users");
    await truncate("categories");
    return await truncate("units");
  });

  test("should be able use custom primary keys", async () => {
    const uuid = "a1bab8a6-2523-41ba-961a-a541137908ea";
    const { data, status } = await axios.post("/v1/units", {
      uuid,
      title: "KG",
    });
    expect(status).toBe(200);
    expect(data.uuid).toBe(uuid);
    expect(data.title).toBe("KG");
    expect(data.created_at).toBe(undefined);
    expect(data.updated_at).toBe(undefined);

    const { data: item } = await axios.get(`/v1/units/${uuid}`);
    expect(item.uuid).toBe(uuid);
    expect(item.title).toBe("KG");
    expect(item.created_at).toBe(undefined);
    expect(item.updated_at).toBe(undefined);
  });

  test("should be able use POST validation definitions", async () => {
    const { data, status } = await axiosPost("/v1/units", {
      uuid: "f551f598-1fe9-453d-b5a3-37fcb1505d93",
    });
    expect(status).toBe(400);
    expect(data.errors?.title[0]).toBe("The title field is required.");
  });

  test("should be able use PUT validation definitions", async () => {
    const uuid = "43a1e149-58c4-497f-ad82-9098a5d64b03";
    await axiosPost("/v1/units", {
      uuid,
      title: "Meter",
    });

    const { status, data } = await axiosPut(`/v1/units/${uuid}`, {
      title: "a",
    });
    expect(status).toBe(200);
    expect(data.title).toBe("a");
  });

  test("should not be able use undefined handlers", async () => {
    const { status } = await axiosGet("/v1/units");
    expect(status).toBe(404);
  });

  test("should be able use custom-named relations", async () => {
    const { data: user } = await axiosPost("/v1/users", {
      email: "foo@bar.com",
      name: "John",
      surname: "Doe",
    });

    const { data, status } = await axiosGet(`/v1/users/${user.id}/owned-posts`);
    expect(status).toBe(200);
    expect(typeof data.pagination).toBe("object");

    const { status: suggestedPostStatus } = await axiosGet(
      `/v1/users/${user.id}/suggested-posts`
    );
    expect(suggestedPostStatus).toBe(200);
  });

  test("should be able use recursive models", async () => {
    const { data: root, status: rootStatus } = await axiosPost(
      "/v1/categories",
      {
        title: "Main category",
      }
    );

    expect(rootStatus).toBe(200);
    expect(root.title).toBe("Main category");
    expect(root.parent_id).toBe(null);

    const { data: child, status: childStatus } = await axiosPost(
      `/v1/categories/${root.id}/categories`,
      {
        title: "Child category",
      }
    );

    expect(childStatus).toBe(200);
    expect(child.title).toBe("Child category");
    expect(child.parent_id).toBe(root.id);
  });

  test("should be able get all categories", async () => {
    const { data, status } = await axiosGet(`/v1/categories/all`);

    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
  });
});
