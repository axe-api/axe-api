# `whereNull()`

You can use the `whereNull()` function to filter data with `NULL` operator. There are different versions of this function.

::: info
You should call the `resource()` function before using this function.
:::

::: info
You should call the `paginate()` function after using this function.
:::

## `whereNull(field)`

```ts
import api from "axe-api-client";

// ...
const response = api.resource("users").whereNull("phone").paginate();
```

- `field`: The field name on the resource.

```sql
WHERE `phone` IS NULL
```

## `whereNotNull(field)`

```ts
import api from "axe-api-client";

// ...
const response = api.resource("users")
  .whereNotNull("phone"")
  .paginate()
```

- `field`: The field name on the resource.

```sql
WHERE `phone` NOT IS NULL
```
