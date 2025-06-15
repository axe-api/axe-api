import { describe, it, expect, vi, beforeEach } from "vitest";
import IndexBuilder from "./IndexBuilder";
import { IoCService } from "../Services";

vi.mock("../Services", () => {
  return {
    IoCService: {
      use: vi.fn(),
    },
  };
});

const createMockModel = (name, hasSearch) => ({
  name,
  instance: { search: hasSearch },
});

const createMockVersion = (models) => ({
  modelList: {
    get: () => models,
  },
});

describe("IndexBuilder", () => {
  let mockElastic;

  beforeEach(() => {
    mockElastic = {
      createIndex: vi.fn(),
    };
    IoCService.use.mockResolvedValue(mockElastic);
  });

  it("should not create any index if no model requires search", async () => {
    const version = createMockVersion([
      createMockModel("ModelA", false),
      createMockModel("ModelB", false),
    ]);
    const builder = new IndexBuilder(version);

    await builder.build();

    expect(IoCService.use).not.toHaveBeenCalled();
    expect(mockElastic.createIndex).not.toHaveBeenCalled();
  });

  it("should create indexes only for models with search enabled", async () => {
    const version = createMockVersion([
      createMockModel("ModelA", true),
      createMockModel("ModelB", false),
      createMockModel("ModelC", true),
    ]);
    const builder = new IndexBuilder(version);

    await builder.build();

    expect(IoCService.use).toHaveBeenCalledWith("Elastic");
    expect(mockElastic.createIndex).toHaveBeenCalledTimes(2);
    expect(mockElastic.createIndex).toHaveBeenCalledWith("ModelA");
    expect(mockElastic.createIndex).toHaveBeenCalledWith("ModelC");
  });

  it("should handle case when all models need index", async () => {
    const version = createMockVersion([
      createMockModel("ModelX", true),
      createMockModel("ModelY", true),
    ]);
    const builder = new IndexBuilder(version);

    await builder.build();

    expect(IoCService.use).toHaveBeenCalledWith("Elastic");
    expect(mockElastic.createIndex).toHaveBeenCalledTimes(2);
    expect(mockElastic.createIndex).toHaveBeenCalledWith("ModelX");
    expect(mockElastic.createIndex).toHaveBeenCalledWith("ModelY");
  });
});
