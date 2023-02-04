import { describe, expect, test, beforeEach } from "@jest/globals";
import { IModelService } from "../../../src/Interfaces";
import { ModelService } from "../../../src/Services";
import WithQueryResolver from "../../../src/Resolvers/WithQueryResolver";
import User from "../__Mocks/app/v1/Models/User";
import Post from "../__Mocks/app/v1/Models/Post";
import PostLike from "../__Mocks/app/v1/Models/PostLike";
import Login from "../__Mocks/app/v1/Models/Login";
import Comment from "../__Mocks/app/v1/Models/Comment";
import Author from "../__Mocks/app/v1/Models/Author";

const userInstance = new User();
const postInstance = new Post();
const postLikeInstance = new PostLike();
const loginInstance = new Login();
const commentInstance = new Comment();
const authorInstance = new Author();

const userService = new ModelService("User", userInstance);
const postService = new ModelService("Post", postInstance);
const postLikeService = new ModelService("PostLike", postLikeInstance);
const loginService = new ModelService("Login", loginInstance);
const authorService = new ModelService("Author", authorInstance);
const commentService = new ModelService("Comment", commentInstance);
commentService.columnNames = ["id", "title", "created_at"];

const models: IModelService[] = [
  userService,
  postService,
  postLikeService,
  loginService,
  commentService,
  authorService,
];

let resolver: WithQueryResolver = new WithQueryResolver(userService, models);

describe("WithQueryResolver", () => {
  beforeEach(() => {
    resolver = new WithQueryResolver(userService, models);
  });

  test("should be able to resolve() complex data", () => {
    const result = resolver.resolve(
      "posts{comments{id|title|author},likes},logins"
    );

    // "posts" and "logins" should ve resolved
    expect(result.length).toBe(2);

    // Checking "posts" relation
    expect(result[0].relationship).toBe("posts");
    expect(result[0].relationModel).toBe(postService);
    expect(result[0].fields.length).toBe(0);
    expect(result[0].children.length).toBe(2);

    // Checking "posts.comments" relation
    expect(result[0].children[0].relationship).toBe("comments");
    expect(result[0].children[0].relationModel).toBe(commentService);
    expect(result[0].children[0].fields.length).toBe(2);
    expect(result[0].children[0].children.length).toBe(1);

    // Checking "posts.comments.author" relation
    expect(result[0].children[0].children[0].relationship).toBe("author");
    expect(result[0].children[0].children[0].relationModel).toBe(authorService);
    expect(result[0].children[0].children[0].fields.length).toBe(0);
    expect(result[0].children[0].children[0].children.length).toBe(0);

    // Checking "posts.likes" relation
    expect(result[0].children[1].relationship).toBe("likes");
    expect(result[0].children[1].relationModel).toBe(postLikeService);
    expect(result[0].children[1].fields.length).toBe(0);
    expect(result[0].children[1].children.length).toBe(0);

    // Checking "logins" relation
    expect(result[1].relationship).toBe("logins");
    expect(result[1].relationModel).toBe(loginService);
    expect(result[1].fields.length).toBe(0);
    expect(result[1].children.length).toBe(0);
  });

  test("should be able throw an error undefined expression", () => {
    expect(() =>
      resolver.resolve("posts{comments{id|title|xxx}}")
    ).toThrowError("It is not a field or a relation: xxx");

    expect(() => resolver.resolve("xxx")).toThrowError(
      "Unknown expression: xxx"
    );

    expect(() => resolver.resolve("posts{xxx}")).toThrowError(
      "It is not a field or a relation: xxx"
    );
  });

  test("should be able send empty expression", () => {
    expect(() => resolver.resolve("")).not.toThrowError();
  });
});
