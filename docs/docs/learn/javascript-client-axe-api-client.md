# Axe API Client

<p class="description">
In this section, we will show another tool in the Axe API ecosystem. You have a great tool the fetch data from Axe API servers.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>What is Axe API Client?</li>
  <li>How to use Axe API client?</li>
  <li>What is the active record pattern?</li>
</ul>

## Axe API Client

You can always fetch data from Axe API by sending a simple HTTP request by your favorite tools such as [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) or [axios](https://axios-http.com/docs/intro).

We created another tool which is called `axe-api-client` that you can use. `axe-api-client` is a tool specified for Axe API servers, and designed on the [Active Record Pattern](https://en.wikipedia.org/wiki/Active_record_pattern).

You can use the Axe API Client in both frontend and backend projects.

## Installation

You can use the following command to add `axe-api-client` library to your project.

```bash
$ npm install axe-api-client
```

## Configuration

You can set the basic settings like the following example:

```ts
import api, { IRequest } from "axe-api-client";

api.setConfig({
  baseURL: "https://your-domain.com/api/v1",
  headers: {
    "x-my-common-header": "my-value",
  },
  params: {},
});
```

## Inserting data

You can use the following example to send an insert request to an Axe API server.

::: code-group

```ts [client.ts]
const response = await api.resource("users").insert({
  name: "Karl",
  surname: "Popper",
});
```

```bash [Request]
$ curl \
  -d '{"name":"Karl","surname":"Popper"}' \
  -H "Content-Type: application/json" \
  -X POST https://your-domain.com/api/v1/users
```

```json [[200] Response]
{
  "id": 1,
  "name": "Karl",
  "surname": "Popper"
}
```

:::

## Update

You can use the following example to update a record.

::: code-group

```ts [client.ts]
const response = await api.resource("users/1").update({
  name: "Karl",
  surname: "Popper",
});
```

```bash [Request]
$ curl \
  -d '{"name":"John","surname":"Locke"}' \
  -H "Content-Type: application/json" \
  -X PUT https://your-domain.com/api/v1/users/1
```

```json [[200] Response]
{
  "id": 1,
  "name": "John",
  "surname": "Locke"
}
```

:::

## Patch

You can use the following example to patch a record.

::: code-group

```ts [client.ts]
const response = await api.resource("users/1").patch({
  surname: "Popper",
});
```

```bash [Request]
$ curl \
  -d '{"surname":"Popper"}' \
  -H "Content-Type: application/json" \
  -X PATCH https://your-domain.com/api/v1/users/1
```

```json [[200] Response]
{
  "id": 1,
  "name": "John",
  "surname": "Popper"
}
```

:::

## Delete

You can use the following example to delete a record.

::: code-group

```ts [client.ts]
const response = await api.resource("users/1").delete();
```

```bash [Request]
$ curl \
  -H "Content-Type: application/json" \
  -X DELETE https://your-domain.com/api/v1/users/1
```

```json [[204] Response]
// empty-response
```

:::

## Find

You can get a single record by using the `find` function.

::: code-group

```ts [client.ts]
const user = await api.find("users/1");
```

```bash [Request]
$ curl \
  -H "Content-Type: application/json" \
  -X GET https://your-domain.com/api/v1/users/1
```

```json [[200] Response]
{
  "id": 1,
  "name": "...",
  "created_at": "2021-10-21 00:00:00",
  "updated_at": "2021-10-21 00:00:00"
}
```

:::

## Paginate

Axe API client library has advanced query features that work Axe API server perfectly.

For example, you can paginate items easily.

::: code-group

```ts [client.ts]
const response = await api.resource("users").paginate();
```

```bash [Request]
$ curl \
  -H "Content-Type: application/json" \
  -X GET https://your-domain.com/api/v1/users?page=1&perPage=10
```

```json [[200] Response]
{
  "data": [
    {
      "id": 1,
      "name": "...",
      "surname": "...",
      "created_at": "2021-10-21 00:00:00",
      "updated_at": "2021-10-21 00:00:00"
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

You can use `page` or `perPage` parameters to fetch the correct page.

::: code-group

```ts [client.ts]
const response = await api.resource("users").paginate({ page: 10, perPage: 5 });
```

```bash [Request]
$ curl \
  -H "Content-Type: application/json" \
  -X GET https://your-domain.com/api/v1/users?page=10&perPage=5
```

```json [[200] Response]
{
  "data": [],
  "pagination": {
    "total": 0,
    "lastPage": 0,
    "perPage": 5,
    "currentPage": 10,
    "from": 0,
    "to": 5
  }
}
```

:::

## Fields

You can select which fields should be listed.

::: code-group

```ts [client.ts]
const response = await api
  .resource("users")
  .fields("name", "surname")
  .paginate();
```

```bash [Request]
$ curl \
  -H "Content-Type: application/json" \
  -X GET https://your-domain.com/api/v1/users?page=1&perPage=10&fields=name,surname
```

```json [[200] Response]
{
  "data": [
    {
      "name": "...",
      "surname": "..."
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

## Sorting

You can sort the items by many fields.

::: code-group

```ts [client.ts]
const response = await api
  .resource("users")
  .sort("name")
  .sort("surname", "DESC")
  .sort("id", "ASC")
  .paginate();
```

```bash [Request]
$ curl \
  -H "Content-Type: application/json" \
  -X GET https://your-domain.com/api/v1/users?page=1&perPage=10&sort=name,-surname,id
```

```json [[200] Response]
{
  "data": [
    {
      "id": 1,
      "name": "...",
      "created_at": "2021-10-21 00:00:00",
      "updated_at": "2021-10-21 00:00:00"
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

## Where

You can filter items by using `where*()` functions. There are many different functions that you can use.

Let's start with a simple condition;

::: code-group

```ts [Example]
const response = await api.resource("users").where("age", 18).paginate();
```

```SQL [SQL Equivalent]
SELECT * FROM users
WHERE `age` = 18;
```

:::

You can add multiple conditions at the same time:

::: code-group

```ts [Example]
const response = await api
  .resource("users")
  .where("age", ">=", 18)
  .where("name", "Karl")
  .paginate();
```

```SQL [SQL Equivalent]
SELECT * FROM users
WHERE `age` >= 18 AND `name` = 'Karl';
```

:::

You can specify the logical operators by using `andWhere` or `orWhere` functions.

::: code-group

```ts [Example]
const response = await api
  .resource("users")
  .where("age", ">=", 18)
  .orWhere("name", "Karl")
  .andWhere("surname", "Popper")
  .paginate();
```

```SQL [SQL Equivalent]
SELECT * FROM users
WHERE `age` >= 18 OR `name` = 'Karl' AND `surname` = 'Popper';
```

:::

You can add multiple child conditions by passing the query function as a parameter.

::: code-group

```ts [Example]
const response = await api
  .resource("users")
  .where((query) => {
    return query.where("name", "Karl").orWhere("surname", "Popper");
  })
  .where("age", ">=", 30)
  .paginate();
```

```SQL [SQL Equivalent]
SELECT * FROM users
WHERE (`name` = 'Karl' OR `surname` = 'Popper') AND `age` >= 30;
```

:::

## Related data

You can fetch the related data.

::: code-group

```ts [client.ts]
const response = await api.resource("users").with("role{title}").paginate();
```

```bash [Request]
$ curl \
  -H "Content-Type: application/json" \
  -X GET https://your-domain.com/api/v1/users?page=1&perPage=10&with=role{title}
```

```json [[200] Response]
{
  "data": [
    {
      "id": 1,
      "name": "...",
      "role": {
        "title": "..."
      },
      "created_at": "2021-10-21 00:00:00",
      "updated_at": "2021-10-21 00:00:00"
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

## Next steps

In this section, we tried to explain the fundamentals of the Axe API Client.

There are many useful functions that you can use. You can check the API Reference section to learn more.

In the next section, you will learn another cool stuff: the database analyzer.
