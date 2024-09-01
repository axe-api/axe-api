# Model.`createTable()`

Axe API supports timestamps as default. While you are creating a new database table in your migrations, you can add timestamps with the <a href="https://knexjs.org/guide/schema-builder.html#timestamps" target="_blank" rel="noreferrer">Knex.js helpers</a>. After that, you don't have to do anything. Axe API will manage your timestamps automatically.

You can look at the simple timestamp example for a migration file;

```ts
export const up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments();
    table.string("email").unique();
    table.timestamps();
  });
};
```

Axe API use `created_at` column as default column name. But you can change it and use your naming structure. To do that, you should add the following getters in your model;

```ts
import { Model } from "axe-api";

class User extends Model {
  get createdAtColumn(): string {
    return "my_created_at";
  }
}

export default User;
```

If you don't want to use timestamps in a model, you have to return NULL in your timestamp naming getters.

```ts
import { Model } from "axe-api";

class User extends Model {
  get createdAtColumn(): null {
    return null;
  }
}

export default User;
```
