import { describe, it, expect, vi, beforeEach } from "vitest";
import generateDocs from "./SwaggerBuilder";
import { APIService, DocumentationService } from "../Services";
import { HandlerTypes, HttpMethods } from "../Enums";

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

  it("normalizes parameterized URLs to curly braces and adds path parameters", async () => {
    const bookModel = createModel("Book");
    getDocsMock.get.mockReturnValue([
      {
        version: "v1",
        handler: HandlerTypes.SHOW,
        modelService: bookModel,
        parentModel: null,
        model: "Book",
        table: "books",
        columns: [],
        hiddens: [],
        relations: [],
        method: HttpMethods.GET,
        url: "/api/v1/books/:id",
        fillables: [],
        validations: null,
        queryLimits: [],
        queryDefaults: {},
      },
    ]);

    const result = await generateDocs();

    // verify normalization
    expect(result.paths["/api/v1/books/{id}"]).toBeDefined();

    const params = result.paths["/api/v1/books/{id}"].get.parameters;
    expect(params.some((p) => p.in === "path" && p.name === "id")).toBe(true);
  });

  it("normalizes custom routes with params as well", async () => {
    getDocsMock.get.mockReturnValue([]);
    getDocsMock.getCustoms.mockReturnValue([
      { method: HttpMethods.GET, url: "/api/v1/custom/:id" },
    ]);

    const result = await generateDocs();
    expect(result.paths["/api/v1/custom/{id}"]).toBeDefined();
  });
});
