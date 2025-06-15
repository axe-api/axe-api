# Database Configs

:::warning
Axe API uses [knex.js](https://knexjs.org/guide) for database operations. All of the database configurations are the same as [the original documentation](https://knexjs.org/guide/#configuration-options).
:::

::: code-group

```ts [app/config.ts]
import { LogLevels, IApplicationConfig } from "axe-api";

const config: IApplicationConfig = {
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

:::danger
Check the [Knex.js Configuration Options](https://knexjs.org/guide/#configuration-options) if you have any connection issues.
:::

## `client`

`client` means which database you are using. Axe API supports all database that is supported by Knex.js;

- PostgreSQL: `pg`
- CockroachDB: `pg`
- MSSQL: `tedious`
- MySQL: `mysql`
- MariaDB: `mysql`
- SQLite3: `sqlite3`
- Better-SQLite3: `better-sqlite3`
- Oracle: `oracledb`
- Amazon Redshift: `pg`

## `connection`

Connection parameters could be different by the database client. You can check the correct value via Knex.js' documentation.

### `connection.host`

The database host. For example; `127.0.0.1` or `localhost`

### `connection.user`

The database connection user. For example; `root`

### `connection.password`

The database user password.

### `connection.database`

The database schema name.

### `connection.port`

The database port. For example; `3306`

## `pool`

The connection pool setting.

## `migrations`

In this section, you can decide all migration settings.
