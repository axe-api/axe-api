import path from "path";
import { describe, expect, test, beforeEach } from "@jest/globals";
import { TransactionResolver } from "../../../src/Resolvers";
import { ModelService, IoCService, APIService } from "../../../src/Services";
import { HandlerTypes } from "../../../src/Enums";
import User from "../__Mocks/app/v1/Models/User";
import Post from "../__Mocks/app/v1/Models/Post";
import Author from "../__Mocks/app/v1/Models/Author";
import Comment from "../__Mocks/app/v1/Models/Comment";
import { IVersion } from "../../../src/Interfaces";

const userInstance = new User();
const postInstance = new Post();
const authorInstance = new Author();
const commentInstance = new Comment();

const userService = new ModelService("User", userInstance);
const postService = new ModelService("Post", postInstance);
const authorService = new ModelService("Author", authorInstance);
const commentService = new ModelService("Comment", commentInstance);

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
  modelTree: [],
  modelList: [],
} as unknown as IVersion;

const resolve = async (service: ModelService, handlerType: HandlerTypes) => {
  return await new TransactionResolver(VersionMock).resolve(
    service,
    handlerType
  );
};

describe("TransactionResolver", () => {
  beforeEach(() => {
    APIService.setInsance(path.join(__dirname, "..", "Models"));
  });

  test(".resolve() should be able to get the correct option by the global and local handler configuration", async () => {
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

    // Comment Mock
    expect(await resolve(commentService, HandlerTypes.PAGINATE)).toBe(false);
  });
});
