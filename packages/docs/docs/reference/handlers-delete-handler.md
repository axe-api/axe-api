# `DELETE` Handler

:::tip
By default, it is **enabled**.
:::

`DELETE` handlers let the clients delete the selected record by primary key.

```ts
import { Model } from "axe-api";

class User extends Model {}

export default User;
```

Clients can use the following query to fetch data;

```bash
$ curl \
  -H "Content-Type: application/json" \
  -X DELETE http://localhost:3000/api/v1/users/1
```

:::tip
If the selected record could be deleted properly, Axe API will return **HTTP 200**.
:::

:::warning
The record will be marked as **deleted** but **NOT** deleted **completely** from the database table if the [Soft Delete](/reference/model-deleted-at-column) feature is enabled. You can use [FORCE_DELETE](/reference/handlers-force-delete-handler) handler when the soft-delete feature is enabled.
:::
