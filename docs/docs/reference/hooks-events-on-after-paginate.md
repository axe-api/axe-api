# `onAfterPaginate()`

This hook/event is called the after paginating items.

It can be used in the `PAGINATE` handler.

::: code-group

```ts [app/v1/Hooks/User/onAfterPaginate.ts]
import { IAfterPaginateContext } from "axe-api";

export default async (parameters: IAfterPaginateContext) => {
  // do something in here
};
```

:::

## `IAfterPaginateContext`

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
| `result`      | The query result.                                                                                                                       |
