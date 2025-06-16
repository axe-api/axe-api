# `onAfterForceDelete()`

This hook/event is called the after deleting a record.

It can be used in the `FORCE_DELETE` handler.

::: code-group

```ts [app/v1/Hooks/User/onAfterForceDelete.ts]
import { IAfterForceDeleteContext } from "axe-api";

export default async (parameters: IAfterForceDeleteContext) => {
  // do something in here
};
```

:::

## `IAfterForceDeleteContext`

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
