import { describe, expect, jest, test, beforeEach } from "@jest/globals";
import { ConditionTypes, Relationships, SortTypes } from "../../../src/Enums";
import { ModelService, QueryService } from "../../../src/Services";
import {
  IRelation,
  IWhere,
  IModelService,
  IQuery,
} from "../../../src/Interfaces";
import User from "../__Mocks/app/v1/Models/User";
import Post from "../__Mocks/app/v1/Models/Post";
import Comment from "../__Mocks/app/v1/Models/Comment";

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

const postService = new ModelService("Post", new Post());
const commentService = new ModelService("Comment", new Comment());
const models: IModelService[] = [userService, postService, commentService];
let service = new QueryService(userService, models);

describe("QueryService", () => {
  beforeEach(() => {
    service = new QueryService(userService, models);
  });

  test(".get() should be able to return the defaults", async () => {
    const query: IQuery = service.get({});
    expect(query.page).toBe(1);
    expect(query.per_page).toBe(10);
    expect(query.fields.length).toBe(0);
    expect(query.sort.length).toBe(0);
    expect(query.q.length).toBe(0);
    expect(query.with.length).toBe(0);
  });

  test(".get() should be able to resolve the pagination values", async () => {
    const query: IQuery = service.get({ page: 12, per_page: 25 });
    expect(query.page).toBe(12);
    expect(query.per_page).toBe(25);
  });

  test(".get() should be able to resolve fields array", async () => {
    const query: IQuery = service.get({ fields: "name,surname" });
    expect(query.fields.length).toBe(2);
    expect(query.fields[0]).toBe("name");
    expect(query.fields[1]).toBe("surname");
  });

  test(".get() should be able to throw an error if undefined fields queried", async () => {
    expect(() => service.get({ fields: "name,surname,xxx" })).toThrow(
      "Undefined column names: xxx"
    );
  });

  test(".get() should be able to resolve sorting parameters", async () => {
    const query: IQuery = service.get({ sort: "name,-surname" });
    expect(query.sort.length).toBe(2);
    expect(query.sort[0].name).toBe("name");
    expect(query.sort[0].type).toBe(SortTypes.ASC);
    expect(query.sort[1].name).toBe("surname");
    expect(query.sort[1].type).toBe(SortTypes.DESC);
  });

  test(".get() should be able to throw error undefined column sort", async () => {
    expect(() => service.get({ sort: "xxx" })).toThrow(
      "Undefined column names: xxx"
    );
  });

  test(".get() should be resolve where conditions", async () => {
    const query: IQuery = service.get({ q: `{"name.$like":"*ohn*"}` });
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
    const query: IQuery = service.get({
      q: `{"name.$like":"*ohn*","$or.surname.$like":"*d*"}`,
    });
    expect(query.q.length).toBe(2);

    const firstWhere: IWhere = query.q[0] as unknown as IWhere;
    const secondWhere: IWhere = query.q[1] as unknown as IWhere;
    expect(firstWhere.prefix).toBeNull();
    expect(secondWhere.prefix).toBe("or");
  });

  test(".get() should be resolve array based queries", async () => {
    const query: IQuery = service.get({
      q: `[{"name.$like":"*ohn*"},{"$or.surname.$like":"*d*"}]`,
    });
    expect(query.q.length).toBe(2);
    expect(Array.isArray(query.q[0])).toBe(true);

    const where: IWhere = query.q[0][0] as unknown as IWhere;
    expect(where.field).toBe("name");
  });

  test(".get() should be resolve null queries", async () => {
    const query: IQuery = service.get({
      q: `{"name":null}`,
    });

    expect(query.q.length).toBe(1);

    const where: IWhere = query.q[0] as unknown as IWhere;
    expect(where.condition).toBe(ConditionTypes.Null);
    expect(where.value).toBe(null);
  });

  test(".get() should be parse values to an arry in-based queries", async () => {
    const query: IQuery = service.get({
      q: `{"name.$in":"Özgür,Adem,Işıklı"}`,
    });

    expect(query.q.length).toBe(1);

    const where: IWhere = query.q[0] as unknown as IWhere;
    expect(where.condition).toBe(ConditionTypes.In);
    expect(where.value.length).toBe(3);
    expect(where.value[0]).toBe("Özgür");
  });

  test(".get() should be resolve relationships", async () => {
    const query: IQuery = service.get({
      with: `posts`,
    });

    expect(query.with.length).toBe(1);
    expect(query.with[0].relationship).toBe("posts");
    expect(query.with[0].relationModel).toBe(postService);
  });
});
