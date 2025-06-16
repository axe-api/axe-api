import { describe, it, expect, vi, beforeEach } from "vitest";
import ModelTreeBuilder from "./ModelTreeBuilder";
import { Relationships } from "../Enums";
import { LogService } from "../Services";

vi.mock("../Services", () => ({
  LogService: {
    debug: vi.fn(),
  },
}));

const createModel = ({ name, relations = [] }) => ({
  name,
  relations,
  children: [],
  setAsRecursive: vi.fn(),
});

const createRelation = (type, model, autoRouting = true) => ({
  type,
  model,
  options: { autoRouting },
});

const createVersion = (models) => ({
  name: "v1",
  modelList: {
    get: () => models,
  },
  modelTree: null,
});

describe("ModelTreeBuilder", () => {
  let version;
  let builder;

  beforeEach(() => {
    version = createVersion([]);
    builder = new ModelTreeBuilder(version);
  });

  it("should build a model tree with correct root nodes and structure", async () => {
    const parent = createModel({ name: "Parent" });
    const child = createModel({
      name: "Child",
      relations: [
        createRelation(Relationships.HAS_ONE, "Child"),
        createRelation(Relationships.HAS_MANY, "Child"),
      ],
    });
    const childOfParent = createModel({
      name: "ChildOfParent",
      relations: [createRelation(Relationships.HAS_MANY, "GrandChild", true)],
    });
    const grandChild = createModel({
      name: "GrandChild",
      relations: [],
    });

    parent.relations = [
      createRelation(Relationships.HAS_MANY, "ChildOfParent"),
    ];

    version = createVersion([parent, child, childOfParent, grandChild]);
    builder = new ModelTreeBuilder(version);

    await builder.build();

    // Root node should be `parent`
    expect(version.modelTree).toContain(parent);

    // Should attach children recursively
    expect(parent.children[0]).toBe(childOfParent);
    expect(childOfParent.children[0]).toBe(grandChild);

    // Recursive model handling
    expect(child.setAsRecursive).toHaveBeenCalled();
    expect(version.modelTree).toContain(child);

    // Logging
    expect(LogService.debug).toHaveBeenCalledWith(
      "[v1] Model tree has been created.",
    );
  });

  it("should handle case with no models", async () => {
    version = createVersion([]);
    builder = new ModelTreeBuilder(version);

    await builder.build();

    expect(version.modelTree).toEqual([]);
    expect(LogService.debug).toHaveBeenCalledWith(
      "[v1] Model tree has been created.",
    );
  });

  it("should not mark non-recursive models as recursive", async () => {
    const model = createModel({
      name: "Test",
      relations: [
        createRelation(Relationships.HAS_MANY, "Other"),
        createRelation(Relationships.HAS_MANY, "Another"),
      ],
    });

    version = createVersion([model]);
    builder = new ModelTreeBuilder(version);

    await builder.build();

    expect(model.setAsRecursive).not.toHaveBeenCalled();
  });
});
