# `SHOW` Handler

:::tip
By default, it is **enabled**.
:::

`SHOW` handler returns the selected it by primary key selection.

```ts
import { Model } from "axe-api";

class User extends Model {}

export default User;
```

Clients can use the following query to fetch data;

```bash
$ curl \
  -H "Content-Type: application/json" \
  -X GET http://localhost:3000/api/v1/users/1
```

This is an example result of a pagination request;

```json
{
  "id": 1,
  "name": "Karl Popper",
  "created_at": "2021-10-16T19:18:47.000Z",
  "updated_at": "2021-10-16T19:18:47.000Z"
}
```

:::tip
Clients are free to use [query options](/reference/queries-fields) except pagination.
:::
