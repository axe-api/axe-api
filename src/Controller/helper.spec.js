import { getFormData } from "./Helper";

describe("getFormData", () => {
  test("should be able get form data from an array definition", async () => {
    const request = {
      body: {
        email: "foo@bar.com",
        is_admin: true,
      },
    };
    const fillable = ["email"];
    const result = getFormData(request, fillable);
    expect(result.email).toBe("foo@bar.com");
    expect(result.is_admin).toBe(undefined);
  });

  test("should be able get form data from an object (method specefic) definition", async () => {
    const request = {
      method: "POST",
      body: {
        email: "foo@bar.com",
        is_admin: true,
      },
    };
    const fillable = {
      POST: ["email"],
    };
    const result = getFormData(request, fillable);
    expect(result.email).toBe("foo@bar.com");
    expect(result.is_admin).toBe(undefined);
  });

  test("should be able get empty form data if there is not any definition", async () => {
    const request = {
      method: "POST",
      body: {
        email: "foo@bar.com",
        is_admin: true,
      },
    };
    const fillable = {
      PUT: ["email"],
    };
    const result = getFormData(request, fillable);
    expect(result.email).toBe(undefined);
    expect(result.is_admin).toBe(undefined);
  });
});
