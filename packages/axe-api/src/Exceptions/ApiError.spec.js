import { describe, it, expect } from "vitest";
import ApiError from "./ApiError";
import { StatusCodes } from "../Enums";

describe("ApiError", () => {
  it("should create an instance with default BAD_REQUEST status", () => {
    const error = new ApiError("Invalid input");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe("Invalid input");
    expect(error.status).toBe(StatusCodes.BAD_REQUEST);
    expect(error.type).toBe("ApiError");
  });

  it("should allow setting a custom status code", () => {
    const error = new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

    expect(error.message).toBe("Unauthorized");
    expect(error.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(error.type).toBe("ApiError");
  });
});
