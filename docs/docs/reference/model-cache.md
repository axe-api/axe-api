# Model.`cache()`

You can override API or version-based cache configuration for a specific model or handler.

:::tip
You can find more information in [Cache configs](/reference/cache-configs) section.
:::

## Model-based

The following configuration would be used for [PAGINATE](/reference/handlers-paginate-handler), [ALL](/reference/handlers-all-handler), and [SHOW](/reference/handlers-show-handler) handlers.

```ts
import { Model, CacheStrategies } from "axe-api";

class User extends Model {
  get cache() {
    return {
      enable: true,
      ttl: 300,
      invalidation: CacheStrategies.TimeBased,
    };
  }
}

export default User;
```

## Handler-based

You can define different cache configurations for each handler.

```ts
import { Model, HandlerTypes, CacheStrategies } from "axe-api";

class User extends Model {
  get cache() {
    return [
      {
        handlers: [HandlerTypes.PAGINATE],
        cache: {
          enable: true,
          ttl: 300,
          invalidation: CacheStrategies.TimeBased,
        },
      },
    ];
  }
}

export default User;
```
