# `onAfterShow()`

This hook/event is called the after the fetching an item by id.

It can be used in the `SHOW` handler.

::: code-group

```ts [app/v1/Hooks/User/onAfterShow.ts]
import { IAfterShowContext } from "axe-api";

export default async (parameters: IAfterShowContext) => {
  // do something in here
};
```

:::

## `IAfterShowContext`

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
| `conditions`  | The conditions which has been send by the HTTP client to filter data.                                                                   |
| `item`        | The current record.                                                                                                                     |
