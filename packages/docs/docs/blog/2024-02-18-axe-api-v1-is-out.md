# Axe API v1.1 is out!

`v1.1` comes with two important changes that you can start to use.

Let's discover it more!

## Disabling auto-route creation for has-many relations

You can create a simple has-many relationship by the following example.

```ts
class User extends Model {
  tasks() {
    return this.hasMany("Task", "id", "user_id");
  }
}

class Task extends Model {
  user() {
    return this.belongsTo("User", "user_id", "id");
  }
}
```

By this definition, Axe API creates the following routing structure automatically.

- `/api/v1/users`
- `/api/v1/users/:id/tasks`

On the other hand, you can fetch the related data by using the `with` parameters.

`GET /api/v1/users/1?with=tasks`

```json
{
  "id": 1,
  "name": "Foo bar",
  "tasks": [
    {
      "id": 1,
      "user_id": 1,
      "name": "My task"
    }
  ]
}
```

Before the **disabling auto-route creation** feature, you were helpless if you wanted to use the `with` query but not use the nested URLs. With the new version, you can create a relationship but not nested routes like the following example:

```ts
class User extends Model {
  tasks() {
    return this.hasMany("Task", "id", "user_id", { autoRouting: false });
  }
}

class Task extends Model {
  user() {
    return this.belongsTo("User", "user_id", "id");
  }
}
```

## Supporting robus-validator library

Axe API uses the [validatorjs](https://github.com/mikeerickson/validatorjs) library under the hood. But the library authors weren't interested in the library enough. That's why we created a new form validation library, [robust-validator](https://validator.axe-api.com/).

By default, Axe API will keep using the [validatorjs](https://github.com/mikeerickson/validatorjs). But you can change it with the [robust-validator](https://validator.axe-api.com/) if you want. Just you need to change the configuration file, and install the [robust-validator](https://validator.axe-api.com/).

::: code-group

```ts [app/config.ts]
import path from "path";
import { IApplicationConfig } from "axe-api";

const config: IApplicationConfig = {
  // ...
  validator: "validatorjs" // [!code --]
  validator: "robust-validator" // [!code ++]
  // ...
};

export default config;
```

:::
