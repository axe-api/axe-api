import path from "path";
import { Column } from "knex-schema-inspector/lib/types/column";
import { describe, expect, test, beforeEach, jest } from "@jest/globals";
import { ModelResolver } from "../../../src/Resolvers";
import { IoCService, LogService } from "../../../src/Services";
import { IVersion } from "../../../src/Interfaces";
import { LogLevels } from "../../../src/Enums";

const DBMock = {};

const VersionMock = {
  name: "v1",
  config: {
    transaction: [],
    serializers: [],
    supportedLanguages: ["en"],
    defaultLanguage: "en",
    query: {
      limits: [],
    },
  },
  folders: {
    root: path.join(__dirname, "..", "__Mocks"),
    models: path.join(__dirname, "..", "__Mocks", "app", "v1", "Models"),
  },
  modelTree: [],
  modelList: [],
} as unknown as IVersion;

const SchemaInspectorMock = () => {
  return {
    tables: jest.fn(() => [
      "users",
      "posts",
      "comments",
      "my-authors",
      "logins",
      "post_likes",
    ]),
    columnInfo: jest.fn((table) => {
      return [
        {
          name: "id",
          table,
          data_type: "int",
          is_nullable: false,
          is_unique: false,
          is_primary_key: true,
          is_generated: true,
          has_auto_increment: true,
        } as Column,
      ] as Column[];
    }),
  };
};

describe("ModelResolver", () => {
  beforeEach(() => {
    LogService.setInstance(LogLevels.ERROR);
    IoCService.singleton("Database", () => DBMock);
    IoCService.singleton("SchemaInspector", () => SchemaInspectorMock);
  });

  test(".resolve() should be able to prepare ModelListService", async () => {
    const resolver = new ModelResolver(VersionMock);
    await resolver.resolve();
    const modelList = VersionMock.modelList;
    expect(modelList.get().length).toBe(6);

    const service = modelList.find("User");
    expect(service).not.toBeNull();
    if (service) {
      expect(service.name).toBe("User");
      expect(service.relations.length).toBe(2);
      expect(service.columns.length).toBe(1);
      expect(service.columns[0].table).toBe("users");
      expect(service.columns[0].data_type).toBe("int");
      expect(service.columnNames.length).toBe(1);
      expect(service.columnNames[0]).toBe("id");
      expect((service.instance.fillable as string[]).length).toBe(2);
    }
  });
});
