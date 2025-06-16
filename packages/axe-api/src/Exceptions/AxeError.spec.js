import { describe, it, expect } from "vitest";
import AxeError from "./AxeError";
import { AxeErrorCode } from "src/Enums";

describe("AxeError", () => {
  it("should create an instance with provided code and message", () => {
    const error = new AxeError(
      AxeErrorCode.INVALID_ARGUMENT,
      "Invalid argument provided",
    );

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AxeError);
    expect(error.message).toBe("Invalid argument provided");
    expect(error.code).toBe(AxeErrorCode.INVALID_ARGUMENT);
    expect(error.type).toBe("AxeError");
  });
});
