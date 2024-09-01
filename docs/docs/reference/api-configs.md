# API Configs

::: code-group

```ts [app/config.ts]
import { IApplicationConfig } from "axe-api";

const config: IApplicationConfig = {
  prefix: "api",
  env: process.env.NODE_ENV || "production",
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000,
  pino: {
    ...
  },
  rateLimit: {
    ...
  },
  database: {
    ...
  },
  cache: {
    ...
  },
  redis: {
    ...
  },
  elasticSearch: {
    ...
  },
  search: {
    ...
  }

};

export default config;
```

:::

## `prefix`

`prefix` is the default API prefix that will be used in all routes.

```bash
GET /api/v1/users/:userId/posts/:id
```

Suggestions;

- It should be a string
- Do not use numbers
- You are allowed to keep it empty.

## `env`

`env` means which environment your API will work.

Some examples; are `development`, `testing`, `staging`, and `production`.

Suggestions;

- Using environment variables is suggested
- You SHOULD use `production` for the production environment to protect sensitive data.

## `port`

`port` means in which port the application will run. You can select any port that is available for your setup.
