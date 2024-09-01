# `onAfterInit`

The initialization function is triggered after the Axe API created routes.

::: code-group

```ts [app/v1/init.ts]
import { App } from "axe-api";

const onAfterInit = async (app: App) => {
  // Do anything with the App instance
};

export { onAfterInit };
```

:::
