# Related data queries

<p class="description">
Axe API allows you to define relations between models to create a well-structured API. But that is not all. HTTP clients should be able to get relational data if there is one on the database schema.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>What is relational data?</li>
  <li>What is the under-fetching issue?</li>
  <li>How to define relational data?</li>
  <li>How to query relational data?</li>
  <li>What is over-fetching issue?</li>
  <li>How to get nested relational data?</li>
</ul>

## Relational data

Relational data in APIs refer to structured information that is retrieved and exchanged through an API using the principles of relational databases.

It involves representing data as interconnected tables with defined relationships, such as `one-to-one`, `one-to-many`, or `many-to-many`.

## Under-fetching issue

**_Under-fetching_** is an issue in REST APIs where the server does not provide sufficient data in a single request, leading to multiple round trips.

It occurs when the API endpoint returns a limited set of data, requiring clients to make additional requests to retrieve related or required information. This can result in **_increased network latency_**, **_decreased performance_**, and **_inefficient use of resources_**.

Under-fetching can be mitigated by designing APIs to include related data through expansion mechanisms like query parameters or embedded resources, reducing the need for subsequent requests and improving the overall efficiency of data retrieval.

In Axe API, the **under-fetching** issue is not a topic thanks to relational data queries. It is enabled by default and ready to use.

## Querying related data

We need related models in order to use related queries. So you must have a relation between two models like in the following example.

In this example, there are two models `Post` and `User`. Every post has an `author`.

::: code-group

```ts [Post.ts]
import { Model } from "axe-api";

class Post extends Model {
  author() {
    return this.hasOne("User", "id", "user_id");
  }
}

export default Post;
```

```ts [User.ts]
import { Model } from "axe-api";

class User extends Model {}

export default User;
```

:::

First, let's see how we can paginate all posts;

::: code-group

```bash [cURL]
$ curl \
  -H "Content-Type: application/json" \
  -X GET http://localhost:3000/api/v1/posts
```

```json [HTTP Response]
{
  "data": [
    {
      "id": 100,
      "title": "Welcome to my blog!",
      "user_id": 2,
      "created_at": "2023-04-16T11:37:08.000Z",
      "updated_at": "2023-04-16T11:37:08.000Z"
    }
  ],
  "pagination": {...}
}
```

:::

In an old-school API, you need to send another request to fetch the `author` data (Or even worse, you need to add some query logic to your APIs).

But Axe API allows you by default to use relational queries to fetch that kind of relational data.

Let's check the following example;

::: code-group

```bash [cURL]
$ curl \
  -H "Content-Type: application/json" \
  -X GET http://localhost:3000/api/v1/posts?with=author // [!code focus]
```

```json [HTTP Response]
{
  "data": [
    {
      "id": 100,
      "title": "Welcome to my blog!",
      "user_id": 2,
      "author": { // [!code focus]
        "id": 2, // [!code focus]
        "name": "John", // [!code focus]
        "surname": "Locke", // [!code focus]
        "created_at": "2023-04-16T11:37:08.000Z", // [!code focus]
        "updated_at": "2023-04-16T11:37:08.000Z" // [!code focus]
      }, // [!code focus]
      "created_at": "2023-04-16T11:37:08.000Z",
      "updated_at": "2023-04-16T11:37:08.000Z"
    }
  ],
  "pagination": {...}
}
```

:::

As you can see in the example, you are able to fetch the related `author` data by just adding `?with=author` to the query. You don't need to send another request to the server or add many lines to your API.

## Over-fetching issue

**_Over-fetching_** is an issue in REST APIs where the server returns more data than needed for a specific request, resulting in unnecessary data transmission and increased resource consumption.

It occurs when the API endpoint provides a comprehensive response that includes additional fields or nested data beyond the client's requirements. This can lead to **_increased bandwidth usage_**, **_slower response times_**, and **_decreased performance_**.

In the example above, we asked for the `author` and the API returned all `user` data. Let's assume that we only need the name of the `author`. What we are going to do?

Axe API supports **nested-relational** queries and selecting fields like **GraphQL** style in the `with` parameter. Let's check the following request out.

::: code-group

```bash [cURL]
$ curl \
  -H "Content-Type: application/json" \
  -X GET http://localhost:3000/api/v1/posts?with=author{name} // [!code focus]
```

```json [HTTP Response]
{
  "data": [
    {
      "id": 100,
      "title": "Welcome to my blog!",
      "user_id": 2,
      "author": { // [!code focus]
        "id": 2, // [!code focus]
        "name": "John", // [!code focus]
      }, // [!code focus]
      "created_at": "2023-04-16T11:37:08.000Z",
      "updated_at": "2023-04-16T11:37:08.000Z"
    }
  ],
  "pagination": {...}
}
```

You can decide what kind of field should be returned by using a **GraphQL-ish** query style.

That's pure magic because you don't need to code many lines to support that kind of query. Axe API handles it automatically due to your model relations.

:::tip
You can use the `fields` parameter to decide what main fields should return:

`?fields=id,title&with=author{name}`
:::

## Nested relations

Let's assume that you have more complex relations. In the following example, we have `Post`, `User`, and `Role` models. Every user has a `role`.

::: code-group

```ts [Post.ts]
import { Model } from "axe-api";

class Post extends Model {
  author() {
    return this.hasOne("User", "id", "user_id");
  }
}

export default Post;
```

```ts [User.ts]
import { Model } from "axe-api";

class User extends Model {
  role() {
    return this.hasOne("Role", "id", "role_id");
  }
}

export default User;
```

```ts [Role.ts]
import { Model } from "axe-api";

class Role extends Model {}

export default Role;
```

:::

In this case, we can paginate all posts by adding the `author` data to the response, with the user's role.

::: code-group

```bash [cURL]
$ curl \
  -H "Content-Type: application/json" \
  -X GET http://localhost:3000/api/v1/posts?with=author{name,role{title}} // [!code focus]
```

```json [HTTP Response]
{
  "data": [
    {
      "id": 100,
      "title": "Welcome to my blog!",
      "user_id": 2,
      "author": { // [!code focus]
        "id": 2, // [!code focus]
        "name": "John", // [!code focus]
        "role": { // [!code focus]
          "id": 3, // [!code focus]
          "title": "Editor" // [!code focus]
        } // [!code focus]
      }, // [!code focus]
      "created_at": "2023-04-16T11:37:08.000Z",
      "updated_at": "2023-04-16T11:37:08.000Z"
    }
  ],
  "pagination": {...}
}
```

:::tip
As you can see in the example, you are able to use the field selection and the relation selection in the `with` parameter at the same time.
:::

The best part of using relational queries is you don't need to do anything except define relations.

:::info
**One-to-many** relational queries are disabled by default. But you are able to enable it via configurations anytime.
:::

## Next step

Relational queries are the best elegant feature of Axe API. You would get many benefits while you are doing almost nothing.

In the next section, you will learn another cool stuff: auto-caching.
