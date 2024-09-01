# `paginate()`

You can use this function to paginate the resource.

```ts
import api from "axe-api-client";

// ...
const response = api.resource("users").paginate({
  page: 1,
  perPage: 10,
});
```

- `IPaginate`
  - `page`: The current page. The default value is `1`. It is optional.
  - `perPage`: The value shows how many items will be fetched for each page. The default value is `10`. It is optional.

::: info
You should call the `resource(url: string)` function before using this function.
:::
