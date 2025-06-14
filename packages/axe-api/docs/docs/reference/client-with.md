# `with()`

You can use the `with()` function to determine what kind of relations data will be fetched with the original resource.

```ts
import api from "axe-api-client";

// ...
const response = api
  .resource("orders")
  .with("user")
  .with("book{name,author{name}}")
  .paginate();
```

- `path`: The relation path.

::: tip
You can use multiple times this function for a query.
:::

::: info
You should call the `resource()` function before using this function.
:::

::: info
You should call the `paginate()` function after using this function.
:::
