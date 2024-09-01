# `PATCH` Handler

:::tip
By default, it is **enabled**.
:::

`PATCH` lets the clients update the record by only one field. By default, it is **disabled** but it can be set as **enabled** like the following example;

```ts
import { Model, HandlerTypes } from "axe-api";
const { INSERT, SHOW, UPDATE, DELETE, PAGINATE, PATCH } = HandlerTypes;

class User extends Model {
  get handlers() {
    return [INSERT, SHOW, UPDATE, DELETE, PAGINATE, PATCH];
  }

  get fillable() {
    return ["name", "surname"];
  }
}

export default User;
```

:::warning
The field that will be updated should be defined in the `fillable()` getter.
:::

In this following request, only the record's `name` field will be updated. `surname` field will stay as it is.

```bash
$ curl \
  -H "Content-Type: application/json" \
  -d '{"name": "Karl"}' \
  -X PATCH http://localhost:3000/api/v1/users/1
```

:::tip
For validation will be executed after merging the record's fields and the new data field.
:::
