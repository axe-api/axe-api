import path from "path";
import { describe, expect, jest, test, beforeAll } from "@jest/globals";
import { RouterBuilder } from "../../../src/Builders";
import {
  APIService,
  IoCService,
  LogService,
  ModelService,
} from "../../../src/Services";
import { IModelService, IRelation, IVersion } from "../../../src/Interfaces";
import { Relationships } from "../../../src/Enums";
import User from "../__Mocks/app/v1/Models/User";
import Post from "../__Mocks/app/v1/Models/Post";
import PostLike from "../__Mocks/app/v1/Models/PostLike";
import Comment from "../__Mocks/app/v1/Models/Comment";
import URLService from "../../../src/Services/URLService";

const userService = new ModelService("User", new User());
const postService = new ModelService("Post", new Post());
postService.children = [new ModelService("PostLike", new PostLike())];
postService.relations = [
  {
    type: Relationships.HAS_MANY,
    name: "likes",
    model: "PostLike",
    primaryKey: "id",
    foreignKey: "post_id",
  } as IRelation,
];
const commentService = new ModelService("Comment", new Comment());

const AppMock = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
};
const LogServiceMock = {
  info: jest.fn(),
};
const ModelTreeMock: IModelService[] = [
  userService,
  postService,
  commentService,
];
const ModelListServiceMock = {};
const FoldersMock = {
  App: path.join(__dirname, "..", "__Mocks"),
};
const ConfigMock = {
  Application: {
    transaction: false,
  },
};
const DocumentationServiceMock = {
  push: jest.fn(),
};
const handlerFunctionMock = jest.fn();
const HandlerFactoryMock = {
  get: jest.fn(() => handlerFunctionMock),
};
const DatabaseMock = {
  transaction: jest.fn(),
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
  modelTree: ModelTreeMock,
} as unknown as IVersion;

describe("RouteBuilder", () => {
  beforeAll(() => {
    APIService.setInsance(path.join(__dirname, "..", "__Mocks"));
    LogService.setInstance();
    IoCService.singleton("App", () => AppMock);
    IoCService.singleton(
      "DocumentationService",
      () => DocumentationServiceMock
    );
    IoCService.singleton("HandlerFactory", () => HandlerFactoryMock);
    IoCService.singleton("Database", () => DatabaseMock);
  });

  test("should be able to build express routes", async () => {
    const builder = new RouterBuilder(VersionMock);
    await builder.build();

    // Checking GETs
    const getURLs = URLService.getAllURLs()
      .filter((item) => item.method == "GET")
      .map((item) => item.pattern);
    expect(getURLs.length).toBe(8);
    expect(getURLs.includes("/api/v1/users")).toBeTruthy();
    expect(getURLs.includes("/api/v1/users/:id")).toBeTruthy();
    expect(getURLs.includes("/api/v1/posts/:id")).toBeTruthy();
    expect(getURLs.includes("/api/v1/posts/:postId/likes")).toBeTruthy();
    expect(getURLs.includes("/api/v1/posts/:postId/likes/:id")).toBeTruthy();

    // Checking POSTSs
    const postURLs = URLService.getAllURLs()
      .filter((item) => item.method == "POST")
      .map((item) => item.pattern);
    expect(postURLs.length).toBe(4);
    expect(postURLs.includes("/api/v1/users")).toBeTruthy();
    expect(postURLs.includes("/api/v1/posts")).toBeTruthy();
    expect(postURLs.includes("/api/v1/posts/:postId/likes")).toBeTruthy();
  });
});
