# Model.`hiddens()`

You may want to hide some columns in your API results when you have some sensitive information such as password hash. In this case, you should use the following getters to define which columns will be hide;

```ts
import { Model } from "axe-api";

class User extends Model {
  get hiddens() {
    return ["password", "password_hash"];
  }
}

export default User;
```

:::tip
This definition will be used for all queries, even recursive queries too. You can check the **Queries** section to learn more about queries.
:::
