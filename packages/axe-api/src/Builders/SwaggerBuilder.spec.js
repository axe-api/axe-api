import { describe, it, expect, vi, beforeEach } from "vitest";
import generateDocs from "./SwaggerBuilder";
import { APIService, DocumentationService } from "../Services";

// ✅ fs mock (correct)
vi.mock("fs", async (importActual) => {
  const actual = await importActual();
  return {
    ...actual,
    existsSync: vi.fn().mockReturnValue(false),
  };
});

// ✅ Reset NodeCache before each test
const memoryCache = {};
vi.mock("node-cache", () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        get: vi.fn((key) => memoryCache[key]),
        set: vi.fn((key, val) => {
          memoryCache[key] = val;
        }),
      };
    }),
  };
});

vi.mock("../Services", () => ({
  APIService: {
    getInstance: vi.fn(),
  },
  DocumentationService: {
    getInstance: vi.fn(),
  },
}));

const createModel = (name, handlers = [], columns = [], deleted = false) => ({
  name,
  columns,
  instance: {
    handlers,
    getFillableFields: () => columns.map((c) => c.name),
    deletedAtColumn: deleted ? "deleted_at" : null,
  },
});

const createColumn = (name, data_type) => ({ name, data_type });

describe("generateDocumentation (default export)", () => {
  let getInstanceMock, getDocsMock;

  beforeEach(() => {
    // ❗ Clear the mock cache to avoid false positives
    for (const key in memoryCache) {
      delete memoryCache[key];
    }

    getDocsMock = {
      get: vi.fn().mockReturnValue([]),
      getCustoms: vi.fn().mockReturnValue([]),
    };

    DocumentationService.getInstance.mockReturnValue(getDocsMock);

    getInstanceMock = {
      versions: [
        {
          modelList: {
            get: () => [
              createModel(
                "Post",
                ["insert", "update"],
                [
                  createColumn("title", "varchar"),
                  createColumn("views", "int"),
                ],
              ),
            ],
          },
        },
      ],
      config: { prefix: "/api/" },
      appFolder: "/app",
    };

    APIService.getInstance.mockReturnValue(getInstanceMock);
  });

  it("returns documentation and uses cache on subsequent calls", async () => {
    const result1 = await generateDocs();
    expect(result1.openapi).toBe("3.0.0");

    const result2 = await generateDocs();
    expect(result2).toEqual(result1);
  });

  it("throws if no versions exist", async () => {
    // ❗ Clear cache to force fresh execution
    for (const key in memoryCache) {
      delete memoryCache[key];
    }

    getInstanceMock.versions = [];

    await expect(generateDocs()).rejects.toThrow("The version is not found!");
  });
});
