# `UPDATE` Handler

:::tip
By default, it is **enabled**.
:::

`UPDATE` handlers let the clients update the selected record by primary key.

```ts
import { Model } from "axe-api";

class User extends Model {
  get fillable() {
    return ["name", "surname"];
  }
}

export default User;
```

Clients can use the following query to fetch data;

```bash
$ curl \
  -H "Content-Type: application/json" \
  -d '{"name": "Karl", "surname":"Popper"}' \
  -X PUT http://localhost:3000/api/v1/users/1
```
