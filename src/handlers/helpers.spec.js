import { getFormData, getFormValidation, callHooks } from "./helpers";

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
    const validations = {
      email: "required",
    };
    const result = getFormValidation("POST", validations);
    expect(result.email).toBe("required");
  });

  test("should be able get the validation by the request method", async () => {
    const validations = {
      POST: {
        email: "required",
      },
    };
    const result = getFormValidation("POST", validations);
    expect(result.email).toBe("required");
  });

  test("should be not able get the validation by the wrong request method", async () => {
    const validations = {
      POST: {
        email: "required",
      },
    };
    const result = getFormValidation("PUT", validations);
    expect(result).toBe(undefined);
  });
});

describe("callHooks", () => {
  test("should be able call hooks if there is any", async () => {
    const model = {
      hooks: {
        onBeforeInsert: jest.fn(),
      },
      events: {
        onBeforeInsert: jest.fn(),
      },
    };
    await callHooks(model, "onBeforeInsert", { id: 13 });
    expect(model.hooks.onBeforeInsert.mock.calls.length).toBe(1);
    expect(model.events.onBeforeInsert.mock.calls.length).toBe(1);

    expect(model.hooks.onBeforeInsert.mock.calls[0][0].id).toBe(13);
    expect(model.events.onBeforeInsert.mock.calls[0][0].id).toBe(13);
  });

  test("should not be able call hooks if there is not any hook", async () => {
    const model = {
      hooks: {},
      events: {},
    };
    await callHooks(model, "onBeforeInsert", { id: 13 });
  });
});
