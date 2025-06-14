# Querying data

<p class="description">
Undoubtedly, having a flexible API and being able to query data as we wish is a great convenience. In this section, we will talk about the advantages of Ax API projects and how it can help you.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>What is querying data?</li>
  <li>How you can add a query feature to non-axe APIs?</li>
  <li>How Axe API helps with queries?</li>
  <li>What are the most important query features on Axe API?</li>
  <li>How you can limit query features?</li>
</ul>

## Fundamentals

Querying data on APIs involves retrieving specific information from a server by constructing a URL with query parameters. These parameters, typically appended to the **URL**, specify the desired data, such as filters, sorting, pagination, or search criteria.

The server processes the request and returns a response containing the requested data. Querying allows clients to fetch precisely what they need from the API, enabling targeted data retrieval and efficient usage of network resources.

It facilitates data-driven interactions between client applications and the server, enabling powerful and customizable data retrieval and manipulation.

## Non-Axe API projects

As a developer, you are responsible to add query features to the fetching endpoints such as paginating lists, fetching an item by id, etc.

In a project that is not an Axe API project, you have to add all query features to all data-fetching endpoints manually. Even in the best scenario, you can create some common structure by hand to use for all endpoints/models.

Keeping the same query features all over the API endpoints takes **_time_**, **_attention_**, and **_effort_**.

In Axe API, you don't have those kinds of problems.

## Axe API query features

**Axe API** supports all basic query features by default without the need for any effort. Literally, you don't need to do anything.

Let's assume that you created a model like the following one;

::: code-group

```ts [User.ts]
import { Model } from "axe-api";

class User extends Model {}

export default User;
```

:::

HTTP clients can use all query features automatically in this example, without defining anything at all.

For example, HTTP clients are able to send the following request to select which fields should be added to the pagination response. You can see the HTTP response in the second tab;

::: code-group

```bash{3} [cURL]
$ curl \
  -H "Content-Type: application/json" \
  -X GET http://localhost:3000/api/v1/users?fields=id,name // [!code focus]
```

```json [Response]
{
  "data": [
    {
      "id": 1,
      "name": "John"
    }
  ],
  "pagination": {...}
}
```

:::

We used the `field` parameter to get only selected fields from the endpoint, and we see only selected fields in the response.

This is just a simple demonstration of how it works. There are lots of query features that HTTP clients can use.

## All query features

There are many query features that you can use;

- Selecting fields: `?fields=id,name,surname`
- Sorting items by multiple fields: `?sort=id,name`
- Sorting items by Z->A: `?sort=-name`
- Deciding the record per page: `?per_page=25`
- Fetching the constant page: `?page=10`
- Query items by where conditions: `?q={"name":"John"}`
- Query items by multiple conditions: `?q=[{"name":"John"},{"surname":"Locke"}]`
- Query items by nested conditions: `?q=[[{"name":"John"}],[{"surname":"Locke"}]`
- Query items by `AND`/`OR` prefix: `?q=[{"name":"John"},{"$or.surname":"Locke"}]`
- Query items by different operators:
  - `?q={"age.$gt":18}`
  - `?q={"name.$like":"*joh*"}`
  - `?q={"age.$in":[19, 19, 20]}`
  - etc.
- Fetching related data: `?with=roles{id,title}`
- etc.

As a developer, you don't need to do anything at all to use all of the query features listed here and more.

## Limiting query features

Almost every query feature is enabled by default to be used. Nevertheless, you may not want to enable a query feature in some cases. For example, the `LIKE` operator might use so much system resources on database queries.

You can select which query features are **enabled** or **disabled** for that kind of case. You can set your configuration both in **_application general_** or **_model-based_**.

You can visit the configuration [API reference](/reference/queries-fields) to get more information.

## Next step

Querying data is a very critical part to provide clients with a solid API. You can check more details in the Query References section.

In the following chapter, we are going to talk about relational data queries, which is another missing part for Rest APIs before the Axe API age.
