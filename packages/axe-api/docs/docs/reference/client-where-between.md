# `whereBetween()`

You can use the `whereBetween()` function to filter data with `BETWEEN` operator. There are different versions of this function.

::: info
You should call the `resource()` function before using this function.
:::

::: info
You should call the `paginate()` function after using this function.
:::

## `whereBetween(field, start, end)`

```ts
import api from "axe-api-client";

// ...
const response = api.resource("users").whereBetween("id", 100, 200).paginate();
```

- `field`: The field name on the resource.
- `start`: The start value.
- `end`: The end value.

```sql
WHERE `id` BETWEEN 100, 200
```

## `whereNotBetween(field, start, end)`

```ts
import api from "axe-api-client";

// ...
const response = api
  .resource("users")
  .whereNotBetween("id", 100, 200)
  .paginate();
```

- `field`: The field name on the resource.
- `start`: The start value.
- `end`: The end value.

```sql
WHERE `id` NOT BETWEEN 100, 200
```
