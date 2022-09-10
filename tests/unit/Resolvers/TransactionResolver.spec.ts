import { describe, expect, test, beforeEach, jest } from "@jest/globals";
import { TransactionResolver } from "../../../src/Resolvers";
import { ModelService, IoCService } from "../../../src/Services";
import { HandlerTypes } from "../../../src/Enums";
import User from "../__Mocks/User";
import Post from "../__Mocks/Post";
import Author from "../__Mocks/Author";
import Comment from "../__Mocks/Comment";

const userInstance = new User();
const postInstance = new Post();
const authorInstance = new Author();
const commentInstance = new Comment();

const userService = new ModelService("User", userInstance);
const postService = new ModelService("Post", postInstance);
const authorService = new ModelService("Author", authorInstance);
const commentService = new ModelService("Comment", commentInstance);

const ConfigMock = (transaction) => {
  return {
    Application: {
      transaction,
    },
  };
};

const resolve = async (service: ModelService, handlerType: HandlerTypes) => {
  return await TransactionResolver.resolve(service, handlerType);
};

describe("TransactionResolver", () => {
  beforeEach(() => {});

  test(".resolve() should be able to get the correct option by the global and local handler configuration", async () => {
    IoCService.singleton("Config", () => ConfigMock(false));
    // The User mock checks
    expect(await resolve(userService, HandlerTypes.INSERT)).toBe(true);
    expect(await resolve(userService, HandlerTypes.PAGINATE)).toBe(true);

    // Post Mock
    expect(await resolve(postService, HandlerTypes.PAGINATE)).toBe(false);
    expect(await resolve(postService, HandlerTypes.INSERT)).toBe(true);

    // Author Mock
    expect(await resolve(authorService, HandlerTypes.PAGINATE)).toBe(true);
    expect(await resolve(authorService, HandlerTypes.INSERT)).toBe(true);
    expect(await resolve(authorService, HandlerTypes.DELETE)).toBe(false);

    // Change the default value
    IoCService.singleton("Config", () => ConfigMock(true));

    // Comment Mock
    expect(await resolve(commentService, HandlerTypes.PAGINATE)).toBe(true);
  });
});
