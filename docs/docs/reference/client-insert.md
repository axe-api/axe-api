# `insert()`

```ts
import api from "axe-api-client";

// ...
const user = api.resource("users").insert({
  name: "Karl",
  surname: "Popper",
});
```

- `data`: The data object that you want to insert.

::: info
You should call the `resource(url: string)` function before using this function.
:::
