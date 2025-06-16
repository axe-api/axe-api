# `whereIn()`

You can use the `whereIn()` function to filter data with `IN` operator. There are different versions of this function.

::: info
You should call the `resource()` function before using this function.
:::

::: info
You should call the `paginate()` function after using this function.
:::

## `whereIn(field, value)`

```ts
import api from "axe-api-client";

// ...
const response = api.resource("users").whereIn("id", [1, 2, 3]).paginate();
```

- `field`: The field name on the resource.
- `value`: The value array.

```sql
WHERE `id` IN [1, 2, 3]
```

## `whereNotIn(field, value)`

```ts
import api from "axe-api-client";

// ...
const response = api.resource("users").whereNotIn("id", [1, 2, 3]).paginate();
```

- `field`: The field name on the resource.
- `value`: The value array.

```sql
WHERE `id` NOT IN [1, 2, 3]
```
