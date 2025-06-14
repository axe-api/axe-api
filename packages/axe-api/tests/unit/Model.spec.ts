import { describe, expect, test } from "@jest/globals";
import { HandlerTypes, HttpMethods, Relationships } from "../../src/Enums";
import { IRelation } from "../../src/Interfaces";
import User from "./__Mocks/app/v1/Models/User";
import Post from "./__Mocks/app/v1/Models/Post";
import Author from "./__Mocks/app/v1/Models/Author";
import Login from "./__Mocks/app/v1/Models/Login";
import Comment from "./__Mocks/app/v1/Models/Comment";

let fillable: string[] = [];
let validations: Record<string, string> | null = {};

describe("Models", () => {
  test(".fillable() should be able to return fillablexx fields by the HttpMethod", () => {
    fillable = new User().getFillableFields(HttpMethods.POST);
    expect(fillable.length).toBe(2);
    expect(fillable[0]).toBe("name");
    expect(fillable[1]).toBe("surname");

    fillable = new Post().getFillableFields(HttpMethods.POST);
    expect(fillable.length).toBe(2);
    expect(fillable[0]).toBe("title");
    expect(fillable[1]).toBe("content");

    fillable = new Post().getFillableFields(HttpMethods.PUT);
    expect(fillable.length).toBe(1);
    expect(fillable[0]).toBe("content");

    fillable = new Post().getFillableFields(HttpMethods.PATCH);
    expect(fillable.length).toBe(0);

    fillable = new Post().getFillableFields(HttpMethods.DELETE);
    expect(fillable.length).toBe(0);
  });

  test(".getValidationRules() should be able to return validation object by HttpMethod", () => {
    // There is not any validation for this model
    validations = new User().getValidationRules(HttpMethods.POST);
    expect(validations).toBe(null);

    // There are some validation for the POST method
    validations = new Post().getValidationRules(HttpMethods.POST);
    expect(Object.keys(validations as any).length).toBe(2);
    expect((validations as any).email).toBe("required|email");
    expect((validations as any).name).toBe("required");

    // There is not any validation for this method on the model
    validations = new Post().getValidationRules(HttpMethods.PUT);
    expect(validations).toBe(null);

    // There is not any validation for this method on the model
    validations = new Post().getValidationRules(HttpMethods.PATCH);
    expect(validations).toBe(null);

    // There can not be any validation for DELETE method
    validations = new Post().getValidationRules(HttpMethods.DELETE);
    expect(validations).toBe(null);

    validations = new Author().getValidationRules(HttpMethods.DELETE);
    expect(validations).not.toBe(null);
    expect((validations as any).name).toBe("required");
  });

  test(".getMiddlewares() should be able to return all middlewares by HandlerType", () => {
    // User model doesn't have any middleware
    expect(new User().getMiddlewares(HandlerTypes.PAGINATE).length).toBe(0);

    // Checking Post model's middlewares
    expect(new Post().getMiddlewares(HandlerTypes.PAGINATE).length).toBe(1);
    expect(new Post().getMiddlewares(HandlerTypes.INSERT).length).toBe(1);
    expect(new Post().getMiddlewares(HandlerTypes.DELETE).length).toBe(0);

    // Checking Login model's middlewares
    expect(new Login().getMiddlewares(HandlerTypes.PAGINATE).length).toBe(2);
    expect(new Login().getMiddlewares(HandlerTypes.INSERT).length).toBe(1);
    expect(new Login().getMiddlewares(HandlerTypes.PATCH).length).toBe(1);
    expect(new Login().getMiddlewares(HandlerTypes.DELETE).length).toBe(0);

    // Checking Comment model's middlewares
    expect(new Comment().getMiddlewares(HandlerTypes.PAGINATE).length).toBe(1);
    expect(new Comment().getMiddlewares(HandlerTypes.DELETE).length).toBe(1);
  });

  test("relation creation methods should be able to return a valid IReleation data", () => {
    const instance = new User();
    let relation: IRelation = instance.hasMany("Post", "id", "user_id");
    expect(relation.type).toBe(Relationships.HAS_MANY);
    expect(relation.primaryKey).toBe("id");
    expect(relation.foreignKey).toBe("user_id");
    expect(relation.model).toBe("Post");

    relation = instance.hasOne("Post", "user_id", "id");
    expect(relation.type).toBe(Relationships.HAS_ONE);
    expect(relation.primaryKey).toBe("user_id");
    expect(relation.foreignKey).toBe("id");
    expect(relation.model).toBe("Post");

    relation = instance.belongsTo("Post", "user_id", "id");
    expect(relation.type).toBe(Relationships.HAS_ONE);
    expect(relation.primaryKey).toBe("id");
    expect(relation.foreignKey).toBe("user_id");
    expect(relation.model).toBe("Post");
  });

  test(".table() should be able to return custom table names", () => {
    expect(new User().table).toBe("users");
    expect(new Author().table).toBe("my-authors");
  });
});
