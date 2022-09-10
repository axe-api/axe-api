import path from "path";
import { Column } from "knex-schema-inspector/lib/types/column";
import { describe, expect, test, beforeEach, jest } from "@jest/globals";
import { ModelResolver } from "../../../src/Resolvers";
import { IoCService, ModelListService } from "../../../src/Services";

const LogServiceMock = {
  info: jest.fn(),
};

const FoldersMock = {
  Models: path.join(__dirname, "..", "__Mocks"),
  Hooks: path.join(__dirname, "..", "__Mocks", "hooks"),
  Events: path.join(__dirname, "..", "__Mocks", "hooks"),
};

const DBMock = {};

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
    IoCService.singleton("LogService", () => LogServiceMock);
    IoCService.singleton("Folders", () => FoldersMock);
    IoCService.singleton("Database", () => DBMock);
    IoCService.singleton("SchemaInspector", () => SchemaInspectorMock);
  });

  test(".resolve() should be able to prepare ModelListService", async () => {
    const resolver = new ModelResolver();
    await resolver.resolve();
    const modelList = await IoCService.useByType<ModelListService>(
      "ModelListService"
    );
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
