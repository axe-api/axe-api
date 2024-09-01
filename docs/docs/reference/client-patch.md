# `patch()`

```ts
import api from "axe-api-client";

// ...
const user = api.resource("users/1").patch({
  surname: "Popper",
});
```

- `data`: The data object that you want to patch by the resource.

::: info
You should call the `resource(url: string)` function before using this function.
:::
