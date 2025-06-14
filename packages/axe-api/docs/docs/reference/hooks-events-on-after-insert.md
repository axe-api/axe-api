# `onAfterInsert()`

This hook/event is called the after creating a new record.

It can be used in the `INSERT` handler.

::: code-group

```ts [app/v1/Hooks/User/onAfterInsert.ts]
import { IAfterInsertContext } from "axe-api";

export default async (parameters: IAfterInsertContext) => {
  // do something in here
};
```

:::

## `IAfterInsertContext`

The following parameters can be used in the hook/event function;

| Parameter     | Description                                                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `req`         | [AxeRequest](/reference/axe-request)                                                                                                    |
| `res`         | [AxeResponse](/reference/axe-response)                                                                                                  |
| `model`       | Current model instance. For example; `User`                                                                                             |
| `database`    | Database connection instance. For example <a href="http://knexjs.org/#Installation-client" target="_blank" rel="noreferrer">Knex.js</a> |
| `relation`    | The relation definition if the route is a related route (For example `api/v1/users/:userId/posts`).                                     |
| `parentModel` | The parent model instance if the route is a related route (For example `api/v1/users/:userId/posts`).                                   |
| `item`        | The current record.                                                                                                                     |
| `formData`    | The data has been sent by HTTP client to create or update row.                                                                          |
