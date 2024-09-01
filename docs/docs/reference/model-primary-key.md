# Model.`primaryKey()`

With this getter, you can define the name of the primary key in the database.

The primary key value is `id` by default. Nevertheless, you may change it as you wish by your model definition, like the following code example;

```ts
import { Model } from "axe-api";

class User extends Model {
  get primaryKey() {
    return "uuid";
  }
}

export default User;
```
