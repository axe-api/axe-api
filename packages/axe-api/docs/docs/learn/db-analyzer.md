# How DB Analyzer works?

<p class="description">
Axe API is not just a passive framework that expects all the definitions from the developer. It is a very creative framework that helps developers to reduce mistakes in the development period. In this section, we are going to talk about the DB analyzer.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>What is DB Analyzer?</li>
  <li>What DB Analyzer works?</li>
  <li>What is the metadata?</li>
</ul>

## Analyzing the schema

Axe API fetches the database schema structure in the **_initialization process_**, and keeps it in the memory to understand what kind of tables and data structures you have. It is named **DB Analyzer**.

It is designed to help developers to build the API with minimum errors.

[knex-schema-inspector](https://github.com/knex/knex-schema-inspector) is used under the hood. Since [knex](https://knexjs.org/guide/) supports almost every modern relational database, it works perfectly for all of them.

## Errors

Since the database schema is kept in memory, **_DB Analyzer_** checks your model definitions while you are developing the API.

DB Analyzers throws an error if you define something in your model, which is not found on the database schema.

Let's assume that you have a model like this;

::: code-group

```ts [User.ts]
import { Model } from "axe-api";

class User extends Model {
  fillable() {
    return ["name", "surnamex"]; // [!code focus]
  }
}

export default User;
```

:::

You would get the following error in your terminal if the `users` table doesn't have a column like `surnamex`.

```bash
[UNDEFINED_COLUMN]

User model doesn't have the following columns on the database; "users.surnamex"
```

DB Analyzer checks every table and column definition.

Also, in the HTTP request handling process, it checks the column names if they are actually defined. That way, you won't get an undefined column error from the database server.

## Documentation

Thanks to DB Analyzer, Axe API provides the correct database schema structure to display **_auto-created documentation_**.

You can use the following endpoint to get all **_API metadata_**, including the database schema.

```bash
GET /metadata
```

Also, you can use the following link to get metadata of the example Axe API project (Bookstore API):

[bookstore.axe-api.com/metadata](https://bookstore.axe-api.com/metadata)

## Next step

In this section, we covered what is the DB Analyzer.

In the next chapter, we are going to talk about more advanced topics such as configuration, security, transactions, etc.
