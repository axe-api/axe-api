# Model.`table()`

With this getter, you can define which name is using in the database table.

By default, you don't have to put any table name definition. But again, you may set your table name with `table` getter. If you don't set a `table` getter, we will use the Model name as the table name. But there are only one difference; the table name will be converted to plural if your model name is singular.

```ts
import { Model } from "axe-api";

class User extends Model {
  get table() {
    return "users";
  }
}

export default User;
```

:::tip
We strongly suggest that to use singular model names in general.
:::
