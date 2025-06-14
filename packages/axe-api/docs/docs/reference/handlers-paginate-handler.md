# `PAGINATE` Handler

:::tip
By default, it is **enabled**.
:::

If the **PAGINATE** handler is enabled, clients can paginate all the model data with dynamic query features such as [Where Conditions](/reference/queries-q), [Relation Queries](/reference/queries-with), etc.

This is a simple definition of the PAGINATE handlers;

```ts
import { Model } from "axe-api";

class User extends Model {}

export default User;
```

Clients can use the following query to fetch data;

```bash
$ curl \
  -H "Content-Type: application/json" \
  -X GET http://localhost:3000/api/v1/users
```

This is an example result of a pagination request;

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

:::tip
By default, Axe API doesn't return all records in one request because of performance issues. Clients should use [pagination parameters](/reference/queries-page).
:::
