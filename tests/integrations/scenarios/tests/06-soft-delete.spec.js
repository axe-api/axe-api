/* eslint-disable no-undef */
import axios from "axios";
import dotenv from "dotenv";
import { truncate } from "./helper.js";

jest.useRealTimers();

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.headers.post["Content-Type"] = "application/json";

const DATA = { name: "Item 1" };

const testOnSoftDeleteRecord = async (request, url) => {
  try {
    await request(url);
    expect(true).tobe(false, "This should not be happend.");
  } catch (error) {
    expect(error.response.data.error).toBe(
      "The item is not found on Employee."
    );
    expect(error.response.status).toBe(400);
  }
};

describe("Axe API Soft Delete", () => {
  beforeAll(async () => {
    dotenv.config();
    await truncate("soft_delete_1");
    await truncate("soft_delete_2");
    return await truncate("soft_delete_3");
  });

  afterAll(async () => {
    await truncate("soft_delete_1");
    await truncate("soft_delete_2");
    return await truncate("soft_delete_3");
  });

  test("testing general stuffs", async () => {
    // Main data
    const response1 = await axios.post("/v1/customers", DATA);

    // Child data
    const response2 = await axios.post(
      `/v1/customers/${response1.data.id}/children`,
      DATA
    );
    await axios.post(`/v1/customers/${response1.data.id}/children`, {
      name: "Item 2",
    });

    // Soft delete
    const response3 = await axios.delete(
      `/v1/customers/${response1.data.id}/children/${response2.data.id}`
    );
    expect(response3.status).toBe(200);

    // pagination
    const response4 = await axios.get(
      `/v1/customers/${response1.data.id}/children`
    );
    expect(response4.data.pagination.total).toBe(1);

    // TODO: This feature will be implemented later
    // pagination with trashed
    // const trashedResponse = await axios.get(
    //   `/customers/${response1.data.id}/children?trashed=true`
    // );
    // expect(trashedResponse.data.pagination.total).toBe(2);

    // all
    const response5 = await axios.get(
      `/v1/customers/${response1.data.id}/children/all`
    );
    expect(response5.data.length).toBe(1);

    // We can not do any action on the delete item
    const deletedItemURL = `/v1/customers/${response1.data.id}/children/${response2.data.id}`;
    await testOnSoftDeleteRecord(axios.get, deletedItemURL);
    await testOnSoftDeleteRecord(axios.delete, deletedItemURL);
    await testOnSoftDeleteRecord(axios.put, deletedItemURL);
    await testOnSoftDeleteRecord(axios.patch, deletedItemURL);

    // Parent query with `with` parameter.
    const parentResponse = await axios.get(`/v1/customers?with=children`);
    expect(parentResponse.status).toBe(200);
    expect(parentResponse.data.data.length).toBe(1);
    expect(parentResponse.data.data[0].children.length).toBe(1);
    expect(parentResponse.data.data[0].children[0].id).not.toBe(
      response2.data.id
    );

    // We should be able to use force delete
    const response7 = await axios.delete(
      `/v1/customers/${response1.data.id}/children/${response2.data.id}/force`
    );
    expect(response7.status).toBe(200);
  });

  test("testing child-parent queries", async () => {
    // Main data
    const response1 = await axios.post("/v1/customers", DATA);

    // Child data
    const response2 = await axios.post(
      `/v1/customers/${response1.data.id}/children`,
      DATA
    );

    // Child data
    const response3 = await axios.post(
      `/v1/customers/${response1.data.id}/children/${response2.data.id}/children`,
      DATA
    );

    // Should be able to see undeleted parent data
    let addressResponse = await axios.get(
      `/v1/customers/${response1.data.id}/children/${response2.data.id}/children/${response3.data.id}?with=parent`,
      DATA
    );
    expect(addressResponse.data.parent).not.toBe(null);

    // Deleting second level child
    await axios.delete(
      `/v1/customers/${response1.data.id}/children/${response2.data.id}`,
      DATA
    );

    // Fetching 3. level item when the 2. level has been soft delete
    addressResponse = await axios.get(
      `/v1/customers/${response1.data.id}/children/${response2.data.id}/children/${response3.data.id}?with=parent`,
      DATA
    );
    expect(addressResponse.data.parent).toBe(null);

    // Testing force delete hooks
    try {
      await axios.delete(
        `/v1/customers/${response1.data.id}/children/${response2.data.id}/children/${response3.data.id}/force`
      );
      expect(true).toBe(false, "Force delete hooks are not working.");
    } catch (error) {
      expect(error.response.data.error).toBe("This is just a test message.");
    }
  });
});
