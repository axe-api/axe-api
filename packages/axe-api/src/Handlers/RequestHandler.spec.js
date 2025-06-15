import { describe, it, expect, vi, beforeEach } from "vitest";
import middleware from "./RequestHandler";
import { APIService, IoCService } from "../Services";
import URLService from "../Services/URLService"; // ✅ correct default import
import { toAxeRequestResponsePair } from "../Services/ConverterService";

vi.mock("../Services/URLService", () => {
  return {
    default: {
      match: vi.fn(),
    },
  };
});

vi.mock("../Services/ConverterService", () => ({
  toAxeRequestResponsePair: vi.fn(),
}));

vi.mock("../Services", () => ({
  APIService: {
    getInstance: vi.fn(),
  },
  IoCService: {
    use: vi.fn(),
  },
  LogService: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("RequestHandler middleware", () => {
  let mockReq, mockRes, mockNext, axeRequest, axeResponse, mockValidator;

  beforeEach(() => {
    mockReq = { method: "GET", url: "/example" };
    mockRes = {
      statusCode: 200,
      write: vi.fn(),
      end: vi.fn(),
      setHeader: vi.fn(),
    };
    mockNext = vi.fn();

    axeRequest = {
      currentLanguage: { language: "en" },
      params: {},
      header: vi.fn(),
      original: { tags: [] },
    };

    axeResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      isResponded: vi.fn().mockReturnValue(false),
      statusCode: vi.fn().mockReturnValue(200),
    };

    toAxeRequestResponsePair.mockReturnValue({ axeRequest, axeResponse });

    APIService.getInstance.mockReturnValue({
      config: { disableXPoweredByHeader: false },
    });

    mockValidator = {};

    IoCService.use.mockImplementation(async (service) => {
      if (service === "Database") {
        return {
          transaction: vi.fn().mockResolvedValue({
            rollback: vi.fn(),
            commit: vi.fn(),
          }),
        };
      }
      if (service === "Validator") return mockValidator;
      return {};
    });
  });

  it("calls next(error) for non-ApiError", async () => {
    const err = new Error("Boom!");

    URLService.match.mockReturnValue({
      phases: [
        {
          name: "explode",
          isAsync: true,
          callback: vi.fn(() => {
            throw err;
          }),
        },
      ],
      hasTransaction: false,
      params: {},
      data: {
        version: {
          config: { supportedLanguages: ["en"], defaultLanguage: "en" },
        },
      },
    });

    await middleware(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(err);
  });
});
