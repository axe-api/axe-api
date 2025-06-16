# `FORCE_DELETE` Handler

:::warning
By default, it is **disabled**.
:::

You should add `deletedAtColumn` getter to your model to use this handler. [DELETE](/reference/handlers-delete-handler) handler soft-deletes records if the soft-deleting feature is enabled. But `FORCE_DELETE` deletes records completelty.

You must add the `FORCE_DELETE` handler to your model to enable this handler;

```ts
import { Model, DEFAULT_HANDLERS, HandlerTypes } from "axe-api";

class Customer extends Model {
  get handlers() {
    return [...DEFAULT_HANDLERS, HandlerTypes.FORCE_DELETE];
  }
}

export default Customer;
```

In this following request, the record will be deleted completelty from database table;

```bash
$ curl \
  -H "Content-Type: application/json" \
  -X DELETE http://localhost:3000/api/v1/users/1/force
```
