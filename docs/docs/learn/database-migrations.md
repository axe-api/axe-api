# Migrate database

<p class="description">
Axe API doesn't provide a database migration tool internally. But it uses Knex.js which provides a migration tool. In this section, we are going to talk about the basic of the database migration tool.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>What is Knex.js?</li>
  <li>How to use Knex CLI?</li>
  <li>How to create a database migration file?</li>
  <li>How to execute migrations?</li>
</ul>

Axe API uses [Knex.js](http://knexjs.org/) as the **query builder**. But also, it uses [The Schema Builder of Knex.js](https://knexjs.org/guide/schema-builder.html). You may find more things in the original documentation about the migration than here. But we want to describe some fundamentals about the migration structure.

First of all, we are using the `./migrations` directory to keep the migration files. Also, we are using the power of [Knex.js](http://knexjs.org/) for migrations.

## Installation

To execute the migrations, you need to install the **Knex CLI** in your development environment;

```bash
$ npm install -g knex
```

To test **knex CLI** is accessible, you can use the following command;

```bash
$ knex --version

Knex CLI version: 0.95.5
Knex Local version: 0.95.5
```

## Using CLI

The CLI provides multiple commands to use. On the other hand, [Knex.js](http://knexjs.org/) uses [CommonJS](https://nodejs.org/api/modules.html#modules_modules_commonjs_modules) as the module system. But we are using [ECMAScript modules](https://nodejs.org/api/esm.html#esm_modules_ecmascript_modules). That's why we should use the `--esm` option to execute the migration files.

```bash
$ knex
Usage: cli [options] [command]

Options:
  -V, --version                   output the version number
  --debug                         Run with debugging.
  --knexfile [path]               Specify the knexfile path.
  --knexpath [path]               Specify the path to knex instance.
  --cwd [path]                    Specify the working directory.
  --client [name]                 Set DB client without a knexfile.
  --connection [address]          Set DB connection without a knexfile.
  --migrations-directory [path]   Set migrations directory without a knexfile.
  --migrations-table-name [path]  Set migrations table name without a knexfile.
  --env [name]                    environment, default: process.env.NODE_ENV ||
                                  development
  --esm                           Enable ESM interop.
  --specific [path]               Specify one seed file to execute.
  --timestamp-filename-prefix     Enable a timestamp prefix on name of
                                  generated seed files.
  -h, --help                      display help for command

Commands:
  init [options]                          Create a fresh knexfile.
  migrate:make [options] <name>           Create a named migration file.
  migrate:latest [options]                Run all migrations that have not yet
                                  been run.
  migrate:up [<name>]                     Run the next or the specified
                                  migration that has not yet been run.
  migrate:rollback [options]              Rollback the last batch of migrations
                                  performed.
  migrate:down [<name>]                   Undo the last or the specified
                                  migration that was already run.
  migrate:currentVersion                  View the current version for the
                                  migration.
  migrate:list|migrate:status             List all migrations files with
                                  status.
  migrate:unlock                          Forcibly unlocks the migrations lock
                                  table.
  seed:make [options] <name>              Create a named seed file.
  seed:run [options]                      Run seed files.
  help [command]                  display help for command
```

## Create migration file

To create a new migration file in it, you should use the following command;

```bash
$ knex --esm migrate:make User

Using environment: development
Created Migration: ./migrations/20210515162821_User.js
```

If you look the detail of the file (`migrations/20210515162821_User.js`), you will see the following code;

```js
exports.up = function (knex) {};

exports.down = function (knex) {};
```

Unfortunately, the CLI created the migration file for CommonJS. We should change it with ESM manually.

```js
export const up = function (knex) {};

export const down = function (knex) {};
```

And this is the basic structure of our migration files.

## Upgrading

Let's assume that you've written a migration like this;

```js
export const up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments();
    table.string("name");
    table.string("email").unique();
    table.timestamps();
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("users");
};
```

To execute this migration file, you should execute the following command;

```bash
$ knex --esm migrate:latest

Using environment: development
Batch 1 ran the following migrations:
20210515162821_User.js
```

Yay! You created the first database table.

## Next steps

In this section, we just clarified the fundamentals of database migration.

In this next section, we are going to talk about file uploads.
