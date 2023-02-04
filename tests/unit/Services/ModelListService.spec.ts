import { describe, expect, test } from "@jest/globals";
import { ModelListService, ModelService } from "../../../src/Services";
import { IModelService } from "../../../src/Interfaces";
import User from "../__Mocks/app/v1/Models/User";

const user = new User();
const userService = new ModelService("User", user);
const modelList: IModelService[] = [userService];
const service = new ModelListService(modelList);

describe("ModelListService", () => {
  test(".get() should be able to get all models in the list", async () => {
    expect(service.get().length).toBe(1);
    expect(service.get()[0].name).toBe("User");
    expect(service.get()[0].instance.table).toBe("users");
  });

  test(".find() should be able to find the model by the name", async () => {
    const modelService = service.find("User");
    expect(modelService).not.toBeNull();
    expect(modelService?.name).toBe("User");
    expect(modelService?.instance?.table).toBe("users");
  });

  test(".find() should be able to return null on undefined names", async () => {
    const modelService = service.find("UserX");
    expect(modelService).toBeNull();
  });
});
