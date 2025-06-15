# Configurations

<p class="description">
In this section, we are going to explain how you can configure your API in general. You should use the Configuration References docs to get more detailed information.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>How to handle configurations?</li>
  <li>How to manage API-based configurations?</li>
  <li>How to manage version-based configurations?</li>
  <li>How to use environment variables?</li>
</ul>

## Fundamentals

Axe API has different configuration files to manage your API as you expected. All configuration files are written in **TypeScript**.

A simple configuration file looks like the following example;

```ts
import { IApplicationConfig } from "axe-api";

const config: IApplicationConfig = {
  prefix: "api",
  env: process.env.NODE_ENV || "production",
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000,
  database: {...},
};

export default config;
```

Axe API has two configuration files in a project at least;

- API configuration (`app/config.ts`)
- Version-based configuration files (`app/v1/config.ts`, `app/v2/config.ts`, etc.)

## General configuration file

There is only **one** configuration file to determine how API works in general.

In the general configuration file you can manage;

- API prefix
- `env` value to determining the environment
- Running port
- [pino](https://getpino.io) logger configuration
- Database connection

:::info
You should use the [Configuration References](/reference/api-configs) docs to get more detailed information.
:::

::: code-group

```ts [app/config.ts]
import { LogLevels, IApplicationConfig } from "axe-api";

const config: IApplicationConfig = {
  prefix: "api",
  env: process.env.NODE_ENV || "production",
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000,
  pino: {
    level: "debug",
    transport: {
      target: "pino-pretty",
    },
  },
  rateLimit: {
    enabled: false,
  },
  database: {
    client: process.env.DB_CLIENT || "mysql",
    connection: {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "user",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_DATABASE || "database",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
```

:::

These configuration values are applied to all versions of your API.

## Version-based configurations

Axe API allows you to define **version-specific** configurations. Each API version has to have a configuration file.

In those configuration files, you can manage;

- Database transaction strategy
- Common HTTP response serializer
- i18n configurations
- query limits and defaults

:::info
You should use the [Configuration References](/reference/api-configs) docs to get more detailed information.
:::

You can see a simple example of the _version-based_ configuration file;

::: code-group

```ts [app/v1/config.ts]
import { IVersionConfig, allow, QueryFeature } from "axe-api";

const config: IVersionConfig = {
  transaction: [],
  serializers: [],
  supportedLanguages: ["en"],
  defaultLanguage: "en",
  query: {
    limits: [allow(QueryFeature.All)],
    defaults: {
      perPage: 10,
      minPerPage: 10,
      maxPerPage: 100,
    },
  },
};

export default config;
```

:::

## Using environment varibles

Axe API allows using **environment variables**. It uses the [dotenv](https://www.npmjs.com/package/dotenv) package under the hood to be able to provide environment variables via `.env` files.

In the root directory, you can define a `.env` file and put your environment variables and secret values in it.

::: code-group

```bash [.env]
NODE_ENV=development
APP_PORT=3000
DB_CLIENT=mysql
DB_USER=root
DB_PASSWORD=my_password
DB_DATABASE=my_db
```

:::

:::warning
You should not push the `.env` file to your Git repository. By default, Axe API projects have a `.gitignore` file that denies pushing `.env` files.
:::

:::tip
If you are using [Docker](https://www.docker.com), you can provide the environment variables as described in the Docker documentation.
:::

## Next step

In this section, we covered how Axe API allows to define configuration in general or version-based.

In the next section, we are going to talk about internationalization (i18n).
