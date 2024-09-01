# `onBeforeInit`

The initialization function is triggered before the Axe API starts to create routes.

::: code-group

```ts [app/v1/init.ts]
import { App } from "axe-api";

const onBeforeInit = async (app: App) => {
  // Do anything with the App instance
};

export { onBeforeInit };
```

:::
