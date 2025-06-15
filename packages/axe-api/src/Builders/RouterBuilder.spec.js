import { describe, it, expect, vi, beforeEach } from "vitest";
import RouterBuilder from "./RouterBuilder";
import { HandlerTypes } from "../Enums";
import { API_ROUTE_TEMPLATES } from "../constants";
import { LogService, IoCService, DocumentationService } from "../Services";
import URLService from "../Services/URLService";

vi.mock("../Resolvers/GeneralHookResolver", () => ({
  default: vi.fn().mockImplementation(() => ({
    resolve: vi
      .fn()
      .mockResolvedValue({ onBeforeInit: null, onAfterInit: null }),
  })),
}));

vi.mock("../Services", () => ({
  LogService: {
    debug: vi.fn(),
  },
  IoCService: {
    use: vi.fn(),
  },
  DocumentationService: {
    getInstance: vi.fn().mockReturnValue({
      push: vi.fn(),
    }),
  },
  APIService: {
    getInstance: vi.fn().mockReturnValue({
      config: { prefix: "/api/v1/" },
    }),
  },
}));

vi.mock("../Services/URLService", () => ({
  default: {
    add: vi.fn(),
  },
}));

const createModel = ({
  name,
  handlers = [],
  ignore = false,
  children = [],
  isRecursive = false,
  relations = [],
}) => ({
  name,
  instance: {
    ignore,
    primaryKey: "id",
    handlers,
    getMiddlewares: () => [],
  },
  children,
  isRecursive,
  relations,
});

const createVersion = (models) => ({
  name: "v1",
  modelTree: models,
});

describe("RouterBuilder", () => {
  let version;
  let builder;

  beforeEach(() => {
    URLService.add.mockClear();
    DocumentationService.getInstance().push.mockClear();
    LogService.debug.mockClear();
    IoCService.use.mockResolvedValue({}); // Mock App service
  });

  it("builds routes for models with appropriate handlers", async () => {
    const handlers = Object.keys(API_ROUTE_TEMPLATES);
    const model = createModel({ name: "Post", handlers });

    version = createVersion([model]);
    builder = new RouterBuilder(version);

    await builder.build();

    expect(LogService.debug).toHaveBeenCalledWith(
      "[v1] All endpoints have been created.",
    );
    expect(URLService.add).toHaveBeenCalledTimes(handlers.length);
  });

  it("skips models marked with ignore", async () => {
    const model = createModel({
      name: "SecretModel",
      ignore: true,
      handlers: [HandlerTypes.GET],
    });

    version = createVersion([model]);
    builder = new RouterBuilder(version);

    await builder.build();

    expect(URLService.add).not.toHaveBeenCalled();
  });
});
