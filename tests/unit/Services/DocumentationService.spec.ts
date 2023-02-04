import { describe, expect, test } from "@jest/globals";
import { HttpMethods } from "../../../src/Enums";
import { IRouteDocumentation } from "../../../src/Interfaces";
import { DocumentationService, ModelService } from "../../../src/Services";
import User from "../__Mocks/app/v1/Models/User";

const user = new User();
const userService = new ModelService("User", user);

describe("DocumentationService", () => {
  test("should be able to create documentation data", () => {
    const service = new DocumentationService();
    service.push(HttpMethods.GET, "api/users", userService);

    const items: IRouteDocumentation[] = service.get();

    expect(items.length).toBe(1);
    expect(items[0].model).toBe("User");
    expect(items[0].table).toBe("users");
    expect(items[0].method).toBe("GET");
    expect(items[0].url).toBe("api/users");
  });
});
