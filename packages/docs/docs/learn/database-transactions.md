# Database transactions

<p class="description">
Axe API provides database transaction in a different way since it handles auto-generated routes. In this section, we are going to talk about the database transaction.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>What is database transaction?</li>
  <li>How to create a database transaction?</li>
  <li>What is the version-based database transactions?</li>
  <li>What is the model-based database transactions?</li>
  <li>What is the handler-based database transactions?</li>
  <li>How to access a database transaction from hook and event functions?</li>
</ul>

## Getting started

A database transaction in a REST API refers to a logical unit of work that includes one or more database operations, such as inserting, updating, or deleting records.

It ensures the **consistency** and **integrity** of data by grouping these operations together, making them either all succeed or all fail as a single atomic operation.

Transactions provide a mechanism for maintaining data integrity in complex operations and enable data consistency even in the presence of concurrent access.

## Knex.js example

Axe API uses [Knex.js](https://knexjs.org/) library under the hood. By default, you can use transactions with **Knex.js** like the following code example;

```js
const trx = await knex.transaction();

trx("books")
  .insert({ name: "Old Books" }, "id")
  .then(trx.commit)
  .catch(trx.rollback);
```

This is a simple example of a database transaction.

## Axe API style transactions

We **can't** create a database transaction in Axe API like the example above. Because Axe API generates all routes automatically, and handles them. That's why a database transaction should be able to created by Axe API, and handles by all the HTTP request.

:::tip
Of course, you can create a database transaction inside a simple hook or event function. But there is not any suggestay way to carry the transaction object between different hook files.
:::

There are three strategies to create a database transaction;

- Version-Based
- Model-Based
- Handler-Based

But before to see all of strategies, let's take a look how we can enable transactions for every routes and how we can use it.

## Enable in every routes

To enable transactions in _every route_, you should use the following configuration.

::: code-group

```ts [app/v1/config.ts]
import { IVersionConfig } from "axe-api";

const config: IVersionConfig = {
  // ...
  transaction: true,
  // ...
};

export default config;
```

:::

:::warning
We do **NOT** suggest that enable transaction for all routes. It can cause some performance downgrades.
:::

## Using transaction in hooks

When you enable transaction in a route, Axe API creates a database transaction in the starting of request handling. You can use that transaction variable in hook functions.

::: code-group

```ts [app/v1/Hooks/User/onAfterInsert.ts]
import { IContext } from "axe-api";

export default async ({ database }: IContext) => {
  // If you opened the transaction, `database` object is a
  // transaction database object by default. So you can use the `database.commit()`
  // or `database.rollback()` methods.
};
```

:::

By default, you should **NOT** need to commit the changes. Axe API handles commit and rollback actions instead of you.

But, if you throw an error, Axe API would automatically rollback the transaction. You don't have to do anything special in your hooks excep throwing an error.

::: code-group

```ts [app/v1/Hooks/User/onAfterInsert.ts]
import { ApiError, IContext } from "axe-api";

export default async ({ database }: IContext) => {
  // You can check anything in here and you can throw an HTTP Response as an exception
  throw new ApiError("Unacceptable request!");
};
```

:::

In the example above, Axe API rollback the database transaction and throws the error to the HTTP client.

:::tip
In the example above, you don't need to roll back your transaction. Axe API will handle it by default.
:::

:::warning
Event functions don't work synch with the HTTP request. That's why you can not use database transaction in event functions.
:::

## Version-based transactions

You can enable database transactions by handler types by applying the following codes.

::: code-group

```ts [api/v1/config.ts]
import { IVersionConfig, HandlerTypes } from "axe-api";

const config: IVersionConfig = {
  // ...
  transaction: [
    {
      handler: [HandlerTypes.INSERT, HandlerTypes.UPDATE],
      transaction: true,
    },
  ],
  // ...
};

export default config;
```

:::

In the example above, we basically define that only `INSERT` and `UPDATE` handlers will use a transaction.

## Model-based transactions

In your model file, you can decide to use database transaction for all **model-related** routes like the following example;

::: code-group

```ts [api/v1/Models/User.ts]
import { Model } from "axe-api";

class User extends Model {
  get transaction() {
    return true;
  }
}

export default User;
```

:::

By the example above, all auto-generated routes by `User` model will use a database transaction.

## Handler-based transactions

**Handler-based** database transactions are the most efficient way to define database transaction. By this strategy, you only create database structure for the routes that you really need.

Let's check the following example;

::: code-group

```ts [app/v1/Models/User.ts]
import { Model, HandlerTypes } from "axe-api";

class User extends Model {
  get transaction() {
    return {
      handlers: [HandlerTypes.INSERT],
      transaction: true,
    };
  }
}

export default User;
```

:::

By this model, Axe API creates a database transaction only for the `INSERT` handler.

## Priority of strategies

Axe API uses some priority rules while it deciding to create a database transaction or not. Most-detailed configuration is more important for the Axe API. The importance of the strategies is listed below;

1. Handler-based configurations
2. Model-based configurations
3. Version-based configurations

:::info
`1.` has higher priority than `2.` and `3.`
:::

## Next steps

In this section we tried to describe how you choose a good database transaction strategy for your API routes.

In the next section, we will give an example about how you migrate your database.
