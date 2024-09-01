# Model.`limits()`

You can allow and deny model-based query feature features in here.

```ts
import { Model, QueryFeature, allow, deny } from "axe-api";

class User extends Model {
  get limits() {
    return [
      allow(QueryFeature.WhereLike, ["name"]),
      deny(QueryFeature.WithHasMany),
    ];
  }
}

export default User;
```

:::tip
You can find more information in [Config - Limits](/reference/version-configs.html#query-limits) section.
:::
