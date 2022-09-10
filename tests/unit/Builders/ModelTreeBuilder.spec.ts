import { describe, expect, jest, test, beforeAll } from "@jest/globals";
import { ModelTreeBuilder } from "../../../src/Builders";
import { IoCService, ModelService } from "../../../src/Services";
import { IModelService, IRelation } from "../../../src/Interfaces";
import { Relationships } from "../../../src/Enums";
import User from "../__Mocks/User";
import Post from "../__Mocks/Post";
import PostLike from "../__Mocks/PostLike";
import Comment from "../__Mocks/Comment";

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

describe("ModelTreeBuilder", () => {
  beforeAll(() => {
    IoCService.singleton("LogService", () => LogServiceMock);
    IoCService.singleton("ModelListService", () => ModelListServiceMock);
  });

  test("should be able to create model tree", async () => {
    const builder = new ModelTreeBuilder();
    await builder.build();

    const root = await IoCService.useByType<IModelService[]>("ModelTree");
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
