# `INSERT` Handler

:::tip
By default, it is **enabled**.
:::

This handler means that clients can send a POST request for the model to create a new record on the table. By default, this handler is enabled. If you want to disable it, you should change your model configuration.

You can see an example request for the model definition;

```ts
import { Model } from "axe-api";

class User extends Model {
  get fillable() {
    return ["name", "surname"];
  }
}

export default User;
```

:::tip
If you don't provide the `handlers()` getter, INSERT handler will be enabled by default.
:::

```bash
$ curl \
  -d '{"name": "Karl", "surname":"Popper"}' \
  -H "Content-Type: application/json" \
  -X POST http://localhost:3000/api/v1/users
```

:::warning
As a developer, you should provide at least one fillable field name in the model file. Otherwise, clients can't create a new record.
:::
