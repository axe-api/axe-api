import { describe, expect, jest, test, beforeEach } from "@jest/globals";
import {
  ConditionTypes,
  QueryFeature,
  Relationships,
  SortTypes,
} from "../../../src/Enums";
import { allow, ModelService, QueryService } from "../../../src/Services";
import {
  IRelation,
  IWhere,
  IModelService,
  IQuery,
  IVersionConfig,
  AxeVersionConfig,
} from "../../../src/Interfaces";
import User from "../__Mocks/app/v1/Models/User";
import Post from "../__Mocks/app/v1/Models/Post";
import Comment from "../__Mocks/app/v1/Models/Comment";
import { DEFAULT_VERSION_CONFIG } from "../../../src/constants";

const userService = new ModelService("User", new User());
userService.columnNames = ["name", "surname"];
userService.relations = [
  {
    type: Relationships.HAS_MANY,
    name: "posts",
    model: "Post",
    primaryKey: "id",
    foreignKey: "user_id",
  },
] as IRelation[];
userService.queryLimits = [
  allow(QueryFeature.FieldsAll),
  allow(QueryFeature.WhereIn),
  allow(QueryFeature.WhereNull),
  allow(QueryFeature.WhereLike),
  allow(QueryFeature.Limits),
].flat();

const postService = new ModelService("Post", new Post());
const commentService = new ModelService("Comment", new Comment());
const models: IModelService[] = [userService, postService, commentService];
const config: AxeVersionConfig = {
  ...DEFAULT_VERSION_CONFIG,
};
let service = new QueryService(userService, models, config);

describe("QueryService", () => {
  beforeEach(() => {
    service = new QueryService(userService, models, config);
  });

  test(".get() should be able to return the defaults", async () => {
    const urlSearchParams = new URLSearchParams();
    const query: IQuery = service.get(urlSearchParams);
    expect(query.page).toBe(1);
    expect(query.per_page).toBe(10);
    expect(query.fields.length).toBe(0);
    expect(query.sort.length).toBe(0);
    expect(query.q.length).toBe(0);
    expect(query.with.length).toBe(0);
  });

  test(".get() should be able to resolve the pagination values", async () => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("page", "12");
    urlSearchParams.append("per_page", "25");
    const query: IQuery = service.get(urlSearchParams);
    expect(query.page).toBe(12);
    expect(query.per_page).toBe(25);
  });

  test(".get() should be able to resolve fields array", async () => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("fields", "name,surname");

    const query: IQuery = service.get(urlSearchParams);
    expect(query.fields.length).toBe(2);
    expect(query.fields[0]).toBe("name");
    expect(query.fields[1]).toBe("surname");
  });

  test(".get() should be able to throw an error if undefined fields queried", async () => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("fields", "name,surname,xxx");

    expect(() => service.get(urlSearchParams)).toThrow(
      "Undefined column names: xxx"
    );
  });

  test(".get() should be able to resolve sorting parameters", async () => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("sort", "name,-surname");

    const query: IQuery = service.get(urlSearchParams);
    expect(query.sort.length).toBe(2);
    expect(query.sort[0].name).toBe("name");
    expect(query.sort[0].type).toBe(SortTypes.ASC);
    expect(query.sort[1].name).toBe("surname");
    expect(query.sort[1].type).toBe(SortTypes.DESC);
  });

  test(".get() should be able to throw error undefined column sort", async () => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("sort", "xxx");

    expect(() => service.get(urlSearchParams)).toThrow(
      "Undefined column names: xxx"
    );
  });

  test(".get() should be resolve where conditions", async () => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("q", `{"name.$like":"*ohn*"}`);

    const query: IQuery = service.get(urlSearchParams);
    expect(query.q.length).toBe(1);

    const where: IWhere = query.q[0] as unknown as IWhere;
    expect(where.prefix).toBeNull();
    expect(where.model.name).toBe("User");
    expect(where.table).toBe("users");
    expect(where.field).toBe("name");
    expect(where.condition).toBe(ConditionTypes.LIKE);
    expect(where.value).toBe("%ohn%");
    expect(where.relation).toBeNull();
  });

  test(".get() should be resolve prefixes", async () => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append(
      "q",
      `{"name.$like":"*ohn*","$or.surname.$like":"*d*"}`
    );

    const query: IQuery = service.get(urlSearchParams);
    expect(query.q.length).toBe(2);

    const firstWhere: IWhere = query.q[0] as unknown as IWhere;
    const secondWhere: IWhere = query.q[1] as unknown as IWhere;
    expect(firstWhere.prefix).toBeNull();
    expect(secondWhere.prefix).toBe("or");
  });

  test(".get() should be resolve array based queries", async () => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append(
      "q",
      `[{"name.$like":"*ohn*"},{"$or.surname.$like":"*d*"}]`
    );

    const query: IQuery = service.get(urlSearchParams);
    expect(query.q.length).toBe(2);
    expect(Array.isArray(query.q[0])).toBe(true);

    const where: IWhere = query.q[0][0] as unknown as IWhere;
    expect(where.field).toBe("name");
  });

  test(".get() should be resolve null queries", async () => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("q", `{"name":null}`);

    const query: IQuery = service.get(urlSearchParams);

    expect(query.q.length).toBe(1);

    const where: IWhere = query.q[0] as unknown as IWhere;
    expect(where.condition).toBe(ConditionTypes.Null);
    expect(where.value).toBe(null);
  });

  test(".get() should be parse values to an arry in-based queries", async () => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("q", `{"name.$in":["Özgür","Adem","Işıklı"]}`);

    const query: IQuery = service.get(urlSearchParams);

    expect(query.q.length).toBe(1);

    const where: IWhere = query.q[0] as unknown as IWhere;
    expect(where.condition).toBe(ConditionTypes.In);
    expect(where.value.length).toBe(3);
    expect(where.value[0]).toBe("Özgür");
  });

  test(".get() should be resolve relationships", async () => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("with", `posts`);

    const query: IQuery = service.get(urlSearchParams);

    expect(query.with.length).toBe(1);
    expect(query.with[0].relationship).toBe("posts");
    expect(query.with[0].relationModel).toBe(postService);
  });
});
