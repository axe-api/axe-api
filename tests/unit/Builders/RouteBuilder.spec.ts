import path from "path";
import { Request, Response } from "express";
import { describe, expect, jest, test, beforeAll } from "@jest/globals";
import { RouterBuilder } from "../../../src/Builders";
import { IoCService, ModelService } from "../../../src/Services";
import {
  IModelService,
  IRelation,
  IRequestPack,
} from "../../../src/Interfaces";
import { HandlerTypes, Relationships } from "../../../src/Enums";
import User from "../__Mocks/User";
import Post from "../__Mocks/Post";
import PostLike from "../__Mocks/PostLike";
import Comment from "../__Mocks/Comment";

const waitForIt = (time) => new Promise((resolve) => setTimeout(resolve, time));

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

describe("RouteBuilder", () => {
  beforeAll(() => {
    IoCService.singleton("App", () => AppMock);
    IoCService.singleton("LogService", () => LogServiceMock);
    IoCService.singleton("ModelTree", () => ModelTreeMock);
    IoCService.singleton("ModelListService", () => ModelListServiceMock);
    IoCService.singleton("Folders", () => FoldersMock);
    IoCService.singleton("Config", () => ConfigMock);
    IoCService.singleton(
      "DocumentationService",
      () => DocumentationServiceMock
    );
    IoCService.singleton("HandlerFactory", () => HandlerFactoryMock);
    IoCService.singleton("Database", () => DatabaseMock);
  });

  test("should be able to build express routes", async () => {
    const builder = new RouterBuilder();
    await builder.build();

    // Checking GETs
    const getURLs = AppMock.get.mock.calls.map((item) => item[0]);
    expect(getURLs.length).toBe(8);
    expect(getURLs.includes("/api/users")).toBeTruthy();
    expect(getURLs.includes("/api/users/:id")).toBeTruthy();
    expect(getURLs.includes("/api/posts/:id")).toBeTruthy();
    expect(getURLs.includes("/api/posts/:postId/likes")).toBeTruthy();
    expect(getURLs.includes("/api/posts/:postId/likes/:id")).toBeTruthy();

    // Checking POSTSs
    const postURLs = AppMock.post.mock.calls.map((item) => item[0]);
    expect(postURLs.length).toBe(4);
    expect(postURLs.includes("/api/users")).toBeTruthy();
    expect(postURLs.includes("/api/posts")).toBeTruthy();
    expect(postURLs.includes("/api/posts/:postId/likes")).toBeTruthy();

    // Example handler
    const handler = AppMock.post.mock.calls[0][2] as (
      req: Request,
      res: Response
    ) => void;

    // Response mock
    const response = {
      status: jest.fn(() => {
        return response;
      }),
      json: jest.fn(),
    };
    // Call the handler
    handler({} as Request, response as unknown as Response);

    // Wait for the async call
    await waitForIt(10);

    // Test the mock function has been called
    expect(handlerFunctionMock.mock.calls.length).toBe(1);

    // Should be called correctly
    const params: IRequestPack = (
      handlerFunctionMock.mock.calls[0] as any
    )[0] as IRequestPack;
    expect(params.handlerType).toBe(HandlerTypes.INSERT);
    expect(params.model.name).toBe("User");
  });
});
