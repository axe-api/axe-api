import { StatusCodes } from "../../../src/Enums";
import { describe, expect, test } from "@jest/globals";
import ApiError from "../../../src/Exceptions/ApiError";

describe("ApiError", () => {
  test("should be able to carry additional data with the message", () => {
    const error = new ApiError("My error message");
    expect(error.message).toBe("My error message");
    expect(error.status).toBe(StatusCodes.BAD_REQUEST);
    expect(error.type).toBe("ApiError");
  });
});
