import { getFormData, getFormValidation } from "./Helper";

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

describe("getFormValidation", () => {
  test("should be able get the validation directly", async () => {
    const request = {
      method: "POST",
    };
    const validations = {
      email: "required",
    };
    const result = getFormValidation(request, validations);
    expect(result.email).toBe("required");
  });

  test("should be able get the validation by the request method", async () => {
    const request = {
      method: "POST",
    };
    const validations = {
      POST: {
        email: "required",
      },
    };
    const result = getFormValidation(request, validations);
    expect(result.email).toBe("required");
  });

  test("should be not able get the validation by the wrong request method", async () => {
    const request = {
      method: "PUT",
    };
    const validations = {
      POST: {
        email: "required",
      },
    };
    const result = getFormValidation(request, validations);
    expect(result).toBe(null);
  });
});
