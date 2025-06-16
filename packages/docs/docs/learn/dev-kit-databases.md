# Databases

<p class="description">
In this section, we will cover the database usage in the development environment with all details.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>How Axe API uses databases?</li>
  <li>How to configure a database for dev-kit?</li>
  <li>How to execute database migrations?</li>
</ul>

## Getting started

The `dev-kit` uses `SQLite` as the default database when you installed it. But it doesn't mean that you have to use `SQLite` all the time. Sometimes you going to need other databases such as `MySQL`, `PostgreSQL`, etc.

In this tutorial, we are going to explain how you can manage databases while you are developing new features or fixing a bug on Axe API.

## Configuration

Axe API uses [Knex.js](https://knexjs.org/) as the database library. That's why we have a configuration file in the `dev-kit` folder, which is called `knexfile.js`. You can select different database servers, databases, users, etc by changing that configuration file.

For example' you should apply the folowing changes if you want to work with `MySQL`;

```js
module.exports = {
  client: "mysql",
  connection: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
    database: "my_db",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};
```

:::warning
The configuration file uses environment variables as you can see. You can change the environment variable file, which is called `.env` file, in the `root` directory.
:::

## Migrations

You should execute the migrations to build a database schema on the database. To do that, you should;

- Go to `dev-api` directory (`cd dev-api`)
- Create a new migration file (`knex --esm migrate:make MyFile`)
- Change the migration file content like the following example.
- Execute the migration (`knex --esm migrate:latest`)

You can see here how a migration file looks like;

```js
export const up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments();
    table.string("name");
    table.string("surname");
    table.string("email").unique();
    table.timestamps();
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("users");
};
```

:::tip
You can use the [Schema Builder Documentation](https://knexjs.org/guide/schema-builder.html).
:::

:::warning
Remember, all `knex` cli commands should be executed on the `dev-kit` folder. Because the `knexfile.js` file is located in there.
:::

## Next steps

In this section, we've explained how you can manage your development database.

In the following section, we are going to talk about how you can test your changes in your development environment.
