# Pino (Logger) Config

Axe API uses [pino](https://getpino.io) for logging.

::: code-group

```ts [app/config.ts]
import { IApplicationConfig } from "axe-api";

const config: IApplicationConfig = {
  pino: {
    level: "debug",
    transport: {
      target: "pino-pretty",
    },
  },
};

export default config;
```

:::

All of the database configurations are the same as the original documentation.

:::tip
[pino-pretty](https://github.com/pinojs/pino-pretty) is a basic prettifier for Pino log lines. You don't have to use it in your project.
:::
