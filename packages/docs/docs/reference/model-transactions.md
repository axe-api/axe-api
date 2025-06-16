# Model.`transaction()`

In your model file, you can decide to use database transaction for all **model-related** routes like the following example;

::: code-group

```ts [api/v1/Models/User.ts]
import { Model } from "axe-api";

class User extends Model {
  get transaction() {
    return true;
  }
}

export default User;
```

:::

By the example above, all auto-generated routes by `User` model will use a database transaction.

## Handler-based transactions

**Handler-based** database transactions are the most efficient way to define database transaction. By this strategy, you only create database structure for the routes that you really need.

Let's check the following example;

::: code-group

```ts [app/v1/Models/User.ts]
import { Model, HandlerTypes } from "axe-api";

class User extends Model {
  get transaction() {
    return {
      handlers: [HandlerTypes.INSERT],
      transaction: true,
    };
  }
}

export default User;
```

:::

By this model, Axe API creates a database transaction only for the `INSERT` handler.
