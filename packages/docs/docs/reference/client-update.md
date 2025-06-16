# `update()`

```ts
import api from "axe-api-client";

// ...
const user = api.resource("users/1").update({
  name: "Karl",
  surname: "Popper",
});
```

- `data`: The data object that you want to update by the resource.

::: info
You should call the `resource(url: string)` function before using this function.
:::
