# `where()`

You can use the `where()` function to filter data. There are different versions of this function.

::: info
You should call the `resource()` function before using this function.
:::

::: info
You should call the `paginate()` function after using this function.
:::

## `where(field, value)`

```ts
import api from "axe-api-client";

// ...
const response = api.resource("users").where("name", "Karl").paginate();
```

- `field`: The field name on the resource.
- `value`: The value of the field.

```sql
WHERE `name` = 'Karl'
```

## `where(field, condition, value)`

```ts
import api from "axe-api-client";

// ...
const response = api.resource("users").where("name", "<>", "Karl").paginate();
```

- `field`: The field name on the resource.
- `condition`: The conditon parameter. You can use the following conditions;
  - `=`
  - `<>`
  - `>`
  - `>=`
  - `<`
  - `<=`
- `value`: The value of the field.

```sql
WHERE `name` <> 'Karl'
```

## `where((q: IQueryable) => IQueryable)`

```ts
import api from "axe-api-client";

// ...
const response = api
  .resource("users")
  .where((query: IQueryable) => {
    return query.where("name", "Karl").orWhere("surname", "Popper");
  })
  .paginate();
```

- `queryFunction`: The query function

```sql
WHERE (`name` = 'Karl' or `surname` = 'Popper')
```
