import { describe, expect, jest, test } from "@jest/globals";
import { Extensions, HookFunctionTypes } from "../../../src/Enums";
import { ModelService } from "../../../src/Services";
import { IColumn, IHookParameter } from "../../../src/Interfaces";
import User from "../__Mocks/app/v1/Models/User";

const user = new User();
const userService = new ModelService("User", user);

describe("ModelListService", () => {
  test(".setColumns() should be able to set columns and columnNames", async () => {
    const columns: IColumn[] = [
      {
        name: "id",
        table: "users",
        data_type: "int",
        is_nullable: false,
        is_unique: true,
        is_primary_key: true,
        is_generated: false,
        has_auto_increment: true,
        table_name: "users",
        default_value: null,
        max_length: null,
        numeric_precision: null,
        numeric_scale: null,
        generation_expression: null,
        foreign_key_table: null,
        foreign_key_column: null,
        foreign_key_schema: null,
      },
    ];
    userService.setColumns(columns);
    expect(userService.columnNames.length).toBe(1);
    expect(userService.columnNames[0]).toBe("id");
  });

  test(".setExtensions() should be able to set hooks", async () => {
    const hookFunction = jest.fn();
    userService.setExtensions(
      Extensions.Hooks,
      HookFunctionTypes.onAfterAll,
      hookFunction
    );

    expect(userService.hooks.onAfterDelete).toBeUndefined();
    expect(userService.hooks.onAfterAll).not.toBeUndefined();
    expect(userService.events.onAfterDelete).toBeUndefined();

    const myParams = {};
    userService.hooks.onAfterAll(myParams as IHookParameter);
    expect(userService.hooks.onAfterAll).not.toBeUndefined();

    expect(hookFunction.mock.calls.length).toBe(1);
    expect(hookFunction.mock.calls[0][0]).toBe(myParams);
  });

  test(".setExtensions() should be able to set events", async () => {
    const hookFunction = jest.fn();
    userService.setExtensions(
      Extensions.Events,
      HookFunctionTypes.onAfterAll,
      hookFunction
    );

    expect(userService.events.onAfterDelete).toBeUndefined();
    expect(userService.events.onAfterAll).not.toBeUndefined();
    expect(userService.hooks.onAfterDelete).toBeUndefined();
  });
});
