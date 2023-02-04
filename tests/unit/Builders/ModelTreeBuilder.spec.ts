import path from "path";
import { describe, expect, jest, test, beforeAll } from "@jest/globals";
import { ModelTreeBuilder } from "../../../src/Builders";
import { IoCService, LogService, ModelService } from "../../../src/Services";
import { IModelService, IRelation, IVersion } from "../../../src/Interfaces";
import { LogLevels, Relationships } from "../../../src/Enums";
import User from "../__Mocks/app/v1/Models/User";
import Post from "../__Mocks/app/v1/Models/Post";
import PostLike from "../__Mocks/app/v1/Models/PostLike";
import Comment from "../__Mocks/app/v1/Models/Comment";

const userService = new ModelService("User", new User());
userService.relations = [
  {
    type: Relationships.HAS_MANY,
    name: "posts",
    model: "Post",
    primaryKey: "id",
    foreignKey: "user_id",
  } as IRelation,
];
const postService = new ModelService("Post", new Post());
postService.relations = [
  {
    type: Relationships.HAS_MANY,
    name: "likes",
    model: "PostLike",
    primaryKey: "id",
    foreignKey: "post_id",
  } as IRelation,
  {
    type: Relationships.HAS_MANY,
    name: "comments",
    model: "Comment",
    primaryKey: "id",
    foreignKey: "post_id",
  } as IRelation,
];
const postLikeService = new ModelService("PostLike", new PostLike());
const commentService = new ModelService("Comment", new Comment());

const modelList: IModelService[] = [
  userService,
  postService,
  postLikeService,
  commentService,
];

const LogServiceMock = {
  info: jest.fn(),
};
const ModelListServiceMock = {
  get: () => modelList,
};

const VersionMock = {
  name: "v1",
  config: {
    transaction: [],
    serializers: [],
    supportedLanguages: ["en"],
    defaultLanguage: "en",
  },
  folders: {
    root: path.join(__dirname, "..", "__Mocks"),
    models: path.join(__dirname, "..", "__Mocks", "v1", "Models"),
  },
  modelTree: modelList,
  modelList: ModelListServiceMock,
} as unknown as IVersion;

describe("ModelTreeBuilder", () => {
  beforeAll(() => {
    LogService.setInstance(LogLevels.ERROR);
  });

  test("should be able to create model tree", async () => {
    const builder = new ModelTreeBuilder(VersionMock);
    await builder.build();

    const root = VersionMock.modelTree;
    expect(root.length).toBe(1);

    const user = root[0];
    expect(user.name).toBe("User");
    expect(user.children.length).toBe(1);

    const post = user.children[0];
    expect(post.name).toBe("Post");
    expect(post.children.length).toBe(2);

    expect(post.children[0].name).toBe("PostLike");
    expect(post.children[1].name).toBe("Comment");
  });
});
