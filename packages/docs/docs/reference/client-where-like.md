# `whereLike()`

You can use the `whereLike()` function to filter data with `LIKE` operator. There are different versions of this function.

::: info
You should call the `resource()` function before using this function.
:::

::: info
You should call the `paginate()` function after using this function.
:::

## `whereLike(field, value)`

```ts
import api from "axe-api-client";

// ...
const response = api.resource("users").whereLike("name", "*Karl*").paginate();
```

- `field`: The field name on the resource.
- `value`: The value of the field.

```sql
WHERE `name` LIKE '%Karl%'
```

## `whereNotLike(field, value)`

```ts
import api from "axe-api-client";

// ...
const response = api
  .resource("users")
  .whereNotLike("name", "*Karl*")
  .paginate();
```

- `field`: The field name on the resource.
- `value`: The value of the field.

```sql
WHERE `name` NOT LIKE '%Karl%'
```
