# `onAfterForceDeleteQuery()`

This hook/event is called after the delete query is executed by Axe API.

For example; let's assume that you try to delete a user by a user id. This hook/event is called after the Axe API fetches the record to be deleted.

It can be used in the `FORCE_DELETE` handler.

::: code-group

```ts [app/v1/Hooks/User/onAfterForceDeleteQuery.ts]
import { IAfterForceDeleteQueryContext } from "axe-api";

export default async (parameters: IAfterForceDeleteQueryContext) => {
  // do something in here
};
```

:::

## `IAfterForceDeleteQueryContext`

The following parameters can be used in the hook/event function;

| Parameter     | Description                                                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `req`         | [AxeRequest](/reference/axe-request)                                                                                                    |
| `res`         | [AxeResponse](/reference/axe-response)                                                                                                  |
| `model`       | Current model instance. For example; `User`                                                                                             |
| `database`    | Database connection instance. For example <a href="http://knexjs.org/#Installation-client" target="_blank" rel="noreferrer">Knex.js</a> |
| `relation`    | The relation definition if the route is a related route (For example `api/v1/users/:userId/posts`).                                     |
| `parentModel` | The parent model instance if the route is a related route (For example `api/v1/users/:userId/posts`).                                   |
| `query`       | The Knex.js' <a href="http://knexjs.org/#Builder-wheres" target="_blank" rel="noreferrer">query instance</a>.                           |
| `item`        | The current record.                                                                                                                     |
