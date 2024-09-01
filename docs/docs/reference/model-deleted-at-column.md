# Model.`deletedAtColumn()`

A soft delete marks a record as no longer active or valid without actually deleting it from the database. Soft deletes can improve performance, and can allow “deleted” data to be recovered.

You must define which table column will be used as soft-delete column to keep deletion date;

```js
class Customer extends Model {
  get deletedAtColumn() {
    return "deleted_at";
  }
}

export default Customer;
```

:::warning
Your database table must have `deleted_at` column. The data type must be `DATETIME` and the field should be `nullabe`.

This is a simple migration example you can use;

```js
export const up = function (knex) {
  return knex.schema.createTable("customers", function (table) {
    table.increments();
    table.string("name");
    table.datetime("deleted_at").nullable();
    table.timestamps();
  });
};
```

:::

You can use soft delete feature after this configurations.

:::tip
You can use [FORCE_DELETE](/reference/handlers-force-delete-handler) handler if you want to delete a record completelty.
:::

:::tip
Soft-deleted records are not listed in the results. It is the same for related models, too.
:::
