# `onBeforePatchQuery()`

This hook/event is called before the patch query is executed by Axe API.

For example; let's assume that you try to patch a user by a user id. This hook/event is called before the Axe API fetches the record to be patched.

It can be used in the `PATCH` handler.

::: code-group

```ts [app/v1/Hooks/User/onBeforePatchQuery.ts]
import { IBeforePatchQueryContext } from "axe-api";

export default async (parameters: IBeforePatchQueryContext) => {
  // do something in here
};
```

:::

## `IBeforePatchQueryContext`

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
