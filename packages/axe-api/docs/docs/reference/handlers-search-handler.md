# `SEARCH` Handler

:::warning
By default, it is **disabled**.
:::

You can activate the SEARCH handler to allow HTTP clients to run Elasticsearch-based full-text search queries on the model.

:::warning
Currently, the full-text search feature is **EXPERIMENTAL**.

Still, we strongly suggest to use it in some little parts of your application.
:::

This is a simple definition of the ALL handlers;

```ts
import { Model, DEFAULT_HANDLERS, HandlerTypes } from "axe-api";

class User extends Model {
  get handlers() {
    return [...DEFAULT_HANDLERS, HandlerTypes.SEARCH];
  }
}

export default User;
```

Clients can use the following query to fetch data;

```bash
$ curl \
  -H "Content-Type: application/json" \
  -X GET http://localhost:3000/api/v1/users/search?text=karl
```

This is an example result of the request;

```json
{
  "data": [
    {
      "id": 1,
      "name": "Karl Popper",
      "created_at": "2021-10-16T19:18:47.000Z",
      "updated_at": "2021-10-16T19:18:47.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "lastPage": 1,
    "perPage": 10,
    "currentPage": 1,
    "from": 0,
    "to": 10
  }
}
```
