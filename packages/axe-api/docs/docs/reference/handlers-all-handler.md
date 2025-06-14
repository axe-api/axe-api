# `ALL` Handler

:::warning
By default, it is **disabled**.
:::

If the **ALL** handler is enabled, clients can fetch all records as an array with dynamic query features such as [Where Conditions](/reference/queries-q), [Relation Queries](/reference/queries-with), etc.

:::danger
If your table has millions of records, the API would return all of them. That's why you should be careful while using this handler.
:::

This is a simple definition of the ALL handlers;

```ts
import { Model, DEFAULT_HANDLERS, HandlerTypes } from "axe-api";

class User extends Model {
  get handlers() {
    return [...DEFAULT_HANDLERS, HandlerTypes.ALL];
  }
}

export default User;
```

Clients can use the following query to fetch data;

```bash
$ curl \
  -H "Content-Type: application/json" \
  -X GET http://localhost:3000/api/v1/users/all
```

This is an example result of a pagination request;

```json
[
  {
    "id": 1,
    "name": "Karl Popper",
    "created_at": "2021-10-16T19:18:47.000Z",
    "updated_at": "2021-10-16T19:18:47.000Z"
  }
]
```
