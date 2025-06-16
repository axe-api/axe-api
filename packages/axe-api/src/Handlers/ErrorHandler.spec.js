import { describe, it, expect, vi } from "vitest";
import errorHandler from "./ErrorHandler";

describe("errorHandler middleware", () => {
  it("should set status code to 500, send error JSON, and call next()", () => {
    const mockReq = {};
    const mockRes = {
      statusCode: 200,
      write: vi.fn(),
      end: vi.fn(),
    };
    const mockNext = vi.fn();

    errorHandler(new Error("Something went wrong"), mockReq, mockRes, mockNext);

    expect(mockRes.statusCode).toBe(500);
    expect(mockRes.write).toHaveBeenCalledWith(
      JSON.stringify({ error: "Internal server error" }),
    );
    expect(mockRes.end).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });
});
