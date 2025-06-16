# Search Configs

:::warning
Currently, the full-text search feature is **EXPERIMENTAL**.

Still, we strongly suggest to use it in some little parts of your application.
:::

Axe API provides an full-text search configuration

::: code-group

```ts [app/config.ts]
import { IApplicationConfig } from "axe-api";

const config: IApplicationConfig = {
  search: {
    indexPrefix: "axe",
  },
};

export default config;
```

:::

## `indexPrefix`

You can set a prefix for the model index name prefix.

Let's assume that you have a model named `User`.

If you set the `indexPrefix` value as `my-api`, then the index name would be `my-api-user`.
