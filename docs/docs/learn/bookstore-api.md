# Tutorial: Bookstore API

<p class="description">
This tutorial will guide you in building a small bookstore API with Axe API. Prior knowledge of Axe API is not required, as this tutorial provides a thorough explanation of how Axe API operates and why it is a potent tool.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>How to create a new project</li>
  <li>How to connect a database</li>
  <li>How to define daatabase migrations</li>
  <li>How to create endpoints</li>
  <li>How to validate request data</li>
  <li>How to use middlewares</li>
  <li>How to use hooks</li>
  <li>How to query data</li>
</ul>

## Bookstore API

The **_Bookstore API_** is designed to showcase the fundamental features of Axe API. It includes three tables (`users`, `books`, and `orders`) with corresponding endpoints.

The process of building the API will be demonstrated from scratch.

## Step 1. Installing CLI

To create a new Axe API project, the [axe-magic](https://github.com/axe-api/axe-magic) CLI can be utilized.

The tool can be installed on your device using the specified command.

```bash
$ npm i -g axe-magic
```

After the installation of **_axe-magic_**, the version of the tool can be verified;

```bash
$ axe-magic --version
```

## Step 2. Creating a new project

The **_axe-magic_** CLI is a tool to create a new Axe API project by pulling a template from GitHub and configuring it.

To create a new project, you can use the given command.

```bash
$ axe-magic new bookstore
```

To install the dependencies for the **_bookstore_** project, you need to navigate to the project directory and run the command `npm install` in your terminal.

```bash
$ cd bookstore
$ npm install
```

## Step 3. Setup database

To use Axe API with a relational database system, a running database is required, and a database schema needs to be created to work on it.

Axe API supports many different relational database systems such as _PostgreSQL, CockroachDB, MSSQL, MySQL, MariaDB, SQLite3, Better-SQLite3, Oracle, and Amazon Redshift_.

While this tutorial covers **_MySQL_** and **_PostgreSQL_** examples, the equivalent commands can be used for other databases.

Let's create the `bookstore` schema;

::: code-group

```sql [MySQL]
CREATE DATABASE bookstore
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;
```

```sql [PostgreSQL]
CREATE DATABASE bookstore
  ENCODING 'UTF8'
  LC_COLLATE = 'en_US.UTF-8'
  LC_CTYPE = 'en_US.UTF-8';
```

:::

We should add **_MySQL_** or **_PostgreSQL_** library to dependencies to create a connection.

::: code-group

```bash [MySQL]
$ npm install mysql --save
```

```bash [PostgreSQL]
$ npm install pg --save
```

:::

## Step 4. Setting configurations

To set up the database connection for Axe API, you need to create a `.env` file in the root folder of the project and set the appropriate database connection information.

During initialization, Axe API loads this file and sets up the database connection based on the information provided in the file.

::: code-group

```bash [.env]
NODE_ENV=development
APP_PORT=3000
DB_CLIENT=mysql
DB_HOST=localhost
DB_USER=db-user
DB_PASSWORD=db-password
DB_DATABASE=bookstore
```

:::

## Step 5. Executing the applications

To execute the Axe API application, you can use the command `npm run start:dev` in the terminal, and Axe API will start the server on the defined port in the `.env` file.

```bash
$ npm run start:dev
```

When the API is running correctly, you should see the following messages in your console:

```bash
[18:00:00] INFO: Axe API listens requests on http://localhost:3000
```

This indicates that the Axe API server is listening on the specified URL. To check what your project has, you can visit <a href="http://localhost:3000/routes" target="_blank">localhost:3000/routes</a>.

However, the response will be empty as your project does not currently have any model.

## Step 6. Creating migrations

The next step is to create the database tables. Axe API uses the [knex.js](https://knexjs.org) library for database operations and migrations.

Therefore, you should install the knex CLI on your machine.

```bash
$ npm install -g knex
```

To create a migration file for each table, you can execute the following command:

```bash
$ knex --esm migrate:make 1Users
$ knex --esm migrate:make 2Books
$ knex --esm migrate:make 3Orders
```

To define the structure of each table in a migration file, you can easily copy and paste the following content into each file.

::: code-group

```js [migrations/Users.js]
export const up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments();
    table.string("email").notNullable().unique().index();
    table.string("password").notNullable();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.timestamps();
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("users");
};
```

```js [migrations/Books.js]
export const up = function (knex) {
  return knex.schema.createTable("books", function (table) {
    table.increments();
    table.string("name").notNullable();
    table.string("author").notNullable();
    table.double("price").notNullable();
    table.timestamps();
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("books");
};
```

```js [migrations/Orders.js]
export const up = function (knex) {
  return knex.schema.createTable("orders", function (table) {
    table.increments();
    table.integer("book_id").unsigned().notNullable();
    table.integer("user_id").unsigned().notNullable();
    table.integer("quantity").notNullable().defaultTo(1);
    table.timestamps();

    table
      .foreign("book_id")
      .references("books.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table
      .foreign("user_id")
      .references("users.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("orders");
};
```

:::

Once your migration files are ready, you can use the following command to migrate your database.

```bash
$ knex --esm migrate:latest
```

Let's break down the next steps after connecting to the database and creating tables. These steps are fairly common for other frameworks or libraries as well.

## Step 7. Setting up models

The next task is to set up models, which are located in the `Models` folder under the `app` directory.

In Axe API, you can have multiple versions of your API on the same database schema, which is why you'll find the `app/v1` folder in your project.

Let's create model files for all tables;

::: code-group

```ts [app/v1/Models/User.ts]
import { Model } from "axe-api";

class User extends Model {}

export default User;
```

```ts [app/v1/Models/Book.ts]
import { Model } from "axe-api";

class Book extends Model {}

export default Book;
```

```ts [app/v1/Models/Order.ts]
import { Model } from "axe-api";

class Order extends Model {}

export default Order;
```

:::

After you created models files, you should be able to see the following results when you visit <a href="http://localhost:3000/routes" target="_blank">localhost:3000/routes</a> URL.

```json
[
  "POST /api/v1/books",
  "GET /api/v1/books",
  "GET /api/v1/books/:id",
  "PUT /api/v1/books/:id",
  "PATCH /api/v1/books/:id",
  "DELETE /api/v1/books/:id",
  "POST /api/v1/orders",
  "GET /api/v1/orders",
  "GET /api/v1/orders/:id",
  "PUT /api/v1/orders/:id",
  "PATCH /api/v1/orders/:id",
  "DELETE /api/v1/orders/:id",
  "POST /api/v1/users",
  "GET /api/v1/users",
  "GET /api/v1/users/:id",
  "PUT /api/v1/users/:id",
  "PATCH /api/v1/users/:id",
  "DELETE /api/v1/users/:id"
]
```

You can see the following pagination result when you visit the <a href="http://localhost:3000/api/v1/users" target="_blank">localhost:3000/api/v1/users</a>;

```json
{
  "data": [],
  "pagination": {
    "total": 0,
    "lastPage": 0,
    "perPage": 10,
    "currentPage": 1,
    "from": 0,
    "to": 0
  }
}
```

This result indicates that your models have been analyzed correctly by Axe API and that all endpoints have been added to your API.

Until now, we only created the basic structure of your API but we are going to add more logic in the following steps.

## Step 8. Adding new data

The models are currently only set up for fetching data and not accepting inserted data for security reasons. Developers must define which fields can be filled by clients and specify data validation rules.

The next step is adding the `fillable` and the `validation` getters.

::: code-group

```ts{4-6,8-15} [app/v1/Models/User.ts]
import { Model } from "axe-api";

class User extends Model {
  get fillable() { // [!code focus]
    return ["email", "first_name", "last_name", "password"]; // [!code focus]
  } // [!code focus]

  get validations() { // [!code focus]
    return { // [!code focus]
      email: "required|min:3|max:255|email", // [!code focus]
      first_name: "required|min:2|max:50", // [!code focus]
      last_name: "required|min:2|max:50", // [!code focus]
      password: "required|min:6|max:100", // [!code focus]
    }; // [!code focus]
  } // [!code focus]
}

export default User;
```

```ts{4-6,8-14} [app/v1/Models/Book.ts]
import { Model } from "axe-api";

class Book extends Model {
  get fillable() { // [!code focus]
    return ["name", "author", "price"]; // [!code focus]
  } // [!code focus]

  get validations() { // [!code focus]
    return { // [!code focus]
      name: "required|min:3|max:255", // [!code focus]
      author: "required|min:2|max:50", // [!code focus]
      price: "required|numeric", // [!code focus]
    }; // [!code focus]
  } // [!code focus]
}

export default Book;
```

```ts{4-6,8-14} [app/v1/Models/Order.ts]
import { Model } from "axe-api";

class Order extends Model {
  get fillable() { // [!code focus]
    return ["book_id", "user_id", "quantity"]; // [!code focus]
  } // [!code focus]

  get validations() { // [!code focus]
    return { // [!code focus]
      book_id: "required|numeric", // [!code focus]
      user_id: "required|numeric", // [!code focus]
      quantity: "required|numeric", // [!code focus]
    }; // [!code focus]
  } // [!code focus]
}

export default Order;
```

:::

By using these definitions, we essentially inform Axe API of which fields can be filled and specify the data validation rules to be applied.

Let's try to create a new user without data first;

::: code-group

```bash [cURL]
$ curl \
  -H "Content-Type: application/json" \
  -X POST http://localhost:3000/api/v1/users
```

```json [HTTP Response]
{
  "errors": {
    "email": ["The email field is required."],
    "first_name": ["The first name field is required."],
    "last_name": ["The last name field is required."],
    "password": ["The password field is required."]
  }
}
```

:::

You should be able to see the following error message after the cURL request. This is a validation error that uses by Axe API.

Let's create an acceptable user by sending the following cURL request. If everything goes fine, you should be able to see created user record as an HTTP response.

::: code-group

```bash [cURL]
$ curl \
  -d '{"email": "karl@axe-api.com", "first_name": "Karl", "last_name":"Popper", "password": "my-secret-password"}' \
  -H "Content-Type: application/json" \
  -X POST http://localhost:3000/api/v1/users
```

```json [HTTP Response]
{
  "id": 1,
  "email": "karl@axe-api.com",
  "password": "my-secret-password",
  "first_name": "Karl",
  "last_name": "Popper",
  "created_at": "2023-04-16T11:31:44.000Z",
  "updated_at": "2023-04-16T11:31:44.000Z"
}
```

:::

Since we already have a valid user record, let's create a `book` and an `order`, to use them in the following section of the tutorial.

::: code-group

```bash [Insert a book]
$ curl \
  -d '{"name": "How to build a Rest API?", "author": "Axe API", "price": 50}' \
  -H "Content-Type: application/json" \
  -X POST http://localhost:3000/api/v1/books
```

```bash [Insert an order]
$ curl \
  -d '{"user_id": 1, "book_id": 1, "quantity": 1}' \
  -H "Content-Type: application/json" \
  -X POST http://localhost:3000/api/v1/orders
```

:::

Now we have a **_user_**, a **_book_**, and an **_order_** record on the database.

Let's move to the next chapter.

## Step 9. Creating relations

Axe API has strong abilities to understand the relationship between models. In this section, we are going to define relationships between models and see how we can use them in queries.

Let's define the relations of the `Order` model.

::: code-group

```ts{16-18,20-22} [app/v1/Models/Order.ts]
import { Model } from "axe-api";

class Order extends Model {
  get fillable() {
    return ["book_id", "user_id", "quantity"];
  }

  get validations() {
    return {
      book_id: "required|numeric",
      user_id: "required|numeric",
      quantity: "required|numeric",
    };
  }

  user() { // [!code focus]
    return this.hasOne("User", "id", "user_id"); // [!code focus]
  } // [!code focus]

  book() { // [!code focus]
    return this.hasOne("Book", "id", "book_id"); // [!code focus]
  } // [!code focus]
}

export default Order;
```

:::

In this definition, we tell Axe API that the `Order` model has a **_one-to-one_** relationship with the `User` and `Book` models. Axe API is such a powerful tool that can use this information in queries.

Let's try to paginate orders, first. The response you can get would be like the following JSON;

::: code-group

```bash [cURL]
$ curl \
  -H "Content-Type: application/json" \
  -X GET http://localhost:3000/api/v1/orders
```

```json [HTTP Response]
{
  "data": [
    {
      "id": 1,
      "book_id": 1,
      "user_id": 1,
      "quantity": 1,
      "created_at": "2023-04-16T11:37:08.000Z",
      "updated_at": "2023-04-16T11:37:08.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "lastPage": 1,
    "perPage": 10,
    "currentPage": 1,
    "from": 0,
    "to": 1
  }
}
```

:::

But Axe API provides a `with` parameter to clients, to be able to get related data. Let's try to get orders with `user` and `book` data with the following request.

::: code-group

```bash [cURL]
$ curl \
  -H "Content-Type: application/json" \
  -X GET "http://localhost:3000/api/v1/orders?with=user,book" // [!code focus]
```

```json [HTTP Response]
{
  "data": [
    {
      "id": 1,
      "book_id": 1,
      "user_id": 1,
      "quantity": 1,
      "created_at": "2023-04-16T11:37:08.000Z",
      "updated_at": "2023-04-16T11:37:08.000Z",
      "user": {
        "id": 1,
        "email": "karl@axe-api.com",
        "password": "my-secret-password",
        "first_name": "Karl",
        "last_name": "Popper",
        "created_at": "2023-04-16T11:31:44.000Z",
        "updated_at": "2023-04-16T11:31:44.000Z"
      },
      "book": {
        "id": 1,
        "name": "How to build a Rest API?",
        "author": "Axe API",
        "price": 50,
        "created_at": "2023-04-16T11:36:21.000Z",
        "updated_at": "2023-04-16T11:36:21.000Z"
      }
    }
  ],
  "pagination": {
    "total": 1,
    "lastPage": 1,
    "perPage": 10,
    "currentPage": 1,
    "from": 0,
    "to": 1
  }
}
```

:::

As you can see in the response above, related user and book data have been added to the order response.

We only defined models and their relations. In return, we got so strong API that we can query the data by using relations.

Unlike everybody who says that Rest APIs have **under-fetching** issues, Axe APIs don't have that problem. HTTP clients can get whatever they want whenever they wish from Axe API projects.

## Step 10. Hiding sensitive data

As you can notice, in the previous section Axe API returned the user's password. Of course, this is such unacceptable behavior.

To prevent this issue, Axe API provides many different solutions. The easiest way is using the `hiddens` getter.

```ts{17-19} [app/v1/Models/User.ts]
import { Model } from "axe-api";

class User extends Model {
  get fillable() {
    return ["email", "first_name", "last_name", "password"];
  }

  get validations() {
    return {
      email: "required|min:3|max:255|email",
      first_name: "required|min:2|max:50",
      last_name: "required|min:2|max:50",
      password: "required|min:6|max:100",
    };
  }

  get hiddens() { // [!code focus]
    return ["password"]; // [!code focus]
  } // [!code focus]
}

export default User;
```

After this getter, HTTP clients are not able to see the `password` field in the results.

Let's try the following cURL request.

::: code-group

```bash [cURL]
$ curl \
  -H "Content-Type: application/json" \
  -X GET "http://localhost:3000/api/v1/users/1"
```

```json [HTTP Response]
{
  "id": 1,
  "email": "karl@axe-api.com",
  "first_name": "Karl",
  "last_name": "Popper",
  "created_at": "2023-04-16T11:31:44.000Z",
  "updated_at": "2023-04-16T11:31:44.000Z"
}
```

:::

## Step 11. Adding hooks

Axe API analyzes your models, creates routes, and handles HTTP requests. But the real world is not simple like that.

Until now we've only seen the Axe API magics. But as developers, we should be able to add our **_custom logic_** to the APIs. For example; we should be able to hash the user's password, send a welcome email to the users, check some other things, etc.

Axe API supports a strong **hook** and **event** mechanism that you can add your custom logic to every HTTP request.

As an example, let's try to hash the user's password in the POST request. First, we need to install some dependencies;

```bash
$ npm i --save bcrypt
$ npm i --save-dev @types/bcrypt
```

After that, the only thing to do is add the following hook to your project;

::: code-group

```ts [app/v1/Hooks/User/onBeforeInsert.ts]
import bcrypt from "bcrypt";
import { IContext } from "axe-api";

export default async ({ formData }: IContext) => {
  formData.password = bcrypt.hashSync(formData.password, 10);
};
```

:::

If you look at the path of the file, it clearly describes the hook file is related to `User` model. Also, by the name of the file, this function will be executed **before** **inserting** a new user.

Let's send the following cURL request again to see the results.

```bash
$ curl \
  -d '{"email": "locke@axe-api.com", "first_name": "John", "last_name":"Locke", "password": "my-secret-password"}' \
  -H "Content-Type: application/json" \
  -X POST http://localhost:3000/api/v1/users
```

Since we don't allow to return of the password via API response, you can check the hashed value on the database.

::: code-group

```sql [MySQL]
SELECT * FROM users;
```

```sql [PostgreSQL]
SELECT * FROM users;
```

:::

| id  | email             | password                |
| --- | ----------------- | ----------------------- |
| 1   | karl@axe-api.com  | my-secret-password      |
| 2   | locke@axe-api.com | $2b$10$IyIxdf$IyIxdf... |

## Step 12. Querying data

Once you design your models, Axe API provides powerful query options.

For example; you can decide which `fields` should be listed.

::: code-group

```bash [cURL]
$ curl \
  -H "Content-Type: application/json" \
  -X GET "http://localhost:3000/api/v1/users?fields=id,first_name,last_name" // [!code focus]

```

```json [Response]
{
  "data": [
    {
      "id": 1,
      "first_name": "Karl",
      "last_name": "Popper"
    },
    {
      "id": 2,
      "first_name": "John",
      "last_name": "Locke"
    }
  ],
  "pagination": {
    "total": 2,
    "lastPage": 1,
    "perPage": 10,
    "currentPage": 1,
    "from": 0,
    "to": 2
  }
}
```

:::

HTTP client can decide the sorting field and type. In the following example, records should be sorted by `id` in descending order.

::: code-group

```bash [cURL]
$ curl \
  -H "Content-Type: application/json" \
  -X GET "http://localhost:3000/api/v1/users?sort=-id" // [!code focus]

```

```json [Response]
{
  "data": [
    {
      "id": 2,
      "email": "locke@axe-api.com",
      "first_name": "John",
      "last_name": "Locke",
      "created_at": "2023-04-16T12:25:02.000Z",
      "updated_at": "2023-04-16T12:25:02.000Z"
    },
    {
      "id": 1,
      "email": "karl@axe-api.com",
      "first_name": "Karl",
      "last_name": "Popper",
      "created_at": "2023-04-16T11:31:44.000Z",
      "updated_at": "2023-04-16T11:31:44.000Z"
    }
  ],
  "pagination": {
    "total": 2,
    "lastPage": 1,
    "perPage": 10,
    "currentPage": 1,
    "from": 0,
    "to": 2
  }
}
```

:::

Also, HTTP clients are able to filter data by sending a query;

::: code-group

```bash [cURL]
$ curl \
  -H "Content-Type: application/json" \
  -X GET 'http://localhost:3000/api/v1/users?q=\{%22first_name%22:%22Karl%22\}' // [!code focus]

```

```json [Response]
{
  "data": [
    {
      "id": 1,
      "email": "karl@axe-api.com",
      "first_name": "Karl",
      "last_name": "Popper",
      "created_at": "2023-04-16T11:31:44.000Z",
      "updated_at": "2023-04-16T11:31:44.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "lastPage": 1,
    "perPage": 10,
    "currentPage": 1,
    "from": 0,
    "to": 1
  }
}
```

:::

## Next step

In this chapter, we tried to show what is Axe API and how it works in a simple example. You can be sure that there are more powerful features. This was just a demonstration.

In the next chapter, we are going to talk about Models and reveal their magical sides.
