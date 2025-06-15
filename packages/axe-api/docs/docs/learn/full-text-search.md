# Full-text search <Badge type="warning" text="experimental" />

<p class="description">
Axe API should support a simple full-text search feature via Elasticsearch. In this section, you can learn everything about the full-text search feature.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>What is full-text search?</li>
  <li>How does the full-text search feature work?</li>
  <li>How to configure the full-text search setup?</li>
  <li>How to customize the full-text search query?</li>
</ul>

:::warning
Currently, the full-text search feature is **EXPERIMENTAL**.

Still, we strongly suggest to use it in some little parts of your application.
:::

## What is full-text search?

Full-text search is a technique for searching and retrieving relevant information from a collection of text data. It involves analyzing, indexing, and searching through the entire content of documents, considering words, phrases, and their relationships.

It goes beyond simple keyword matching, incorporating features like stemming, tokenization, and relevance scoring. Full-text search engines, like Elasticsearch or Solr, enable efficient and flexible searches across large datasets, making it crucial for applications like information retrieval, document management, and content discovery.

Axe API supports the `LIKE` keyword on database queries. For example, you can send a LIKE query like this:

`?q={"name.$like":"*john*"}`

This request will be converted `name LIKE '%john%'` SQL command. Unlike indexes that optimize searches, this command scans entire columns, causing slowdowns with large datasets.

Use full-text indexes or other techniques for better performance in complex searches.

:::tip
You can always create your custom full-text search structure if you wish in Axe API by using the [Hooks and Events](/learn/hooks-and-events) structure. Yet Axe API supports a very basic but efficient full-text search solution that you can use on [Elasticsearch](https://www.elastic.co).

In this section, you can learn how to you use that feature on your applications.
:::

## Fundamentals

Axe API supports only [Elasticsearch](https://www.elastic.co).

You can activate the **full-text search** feature for each of your models separately by defining which fields should be indexed.

All indexes will be generated `automatically` by Axe API in the _initialization process_ if the index is not generated yet.

You can add the [SEARCH](/reference/handlers-search-handler) handler to your API endpoints. In that endpoint, you can run a full-text search on the Elasticsearch index for the related model.

The [SEARCH](/reference/handlers-search-handler) handler will be documented automatically on the [Swagger documentation](/learn/documentation).

After Axe API fetches the related data from Elasticsearch, it uses the primary key values to fetch the original record from the database.

This technique allows you to decide what kind of data should be fetched from API. For example, even though you haven't added a field value called `phone` to the Elasticsearch index, you can see that data on the result. Or, you can select only specific fields by using the `field` query parameter. The best news is you can fetch any relational data by using the `with` query feature.

## Configuration

You should configure the Elasticsearch connection via the following file:

::: code-group

```ts [app/config.ts]
import { IApplicationConfig } from "axe-api";

const config: IApplicationConfig = {
  elasticSearch: {
    node: "http://localhost:9200",
  },
};

export default config;
```

:::

Also, you can decide the index prefix that will be used for each model.

::: code-group

```ts [app/config.ts]
import { IApplicationConfig } from "axe-api";

const config: IApplicationConfig = {
  search: {
    indexPrefix: "my-api-prefix",
  },
};

export default config;
```

:::

## Model settings

You should use the `search` getter to define which field values should be indexed on Elasticsearch.

::: code-group

```ts{10-12} [app/v1/Models/User.ts]
import { Model } from "axe-api";

class User extends Model {
  // Which fields should be able to filled by HTTP clients
  get fillable() {
    return ["name", "surname", "email", "phone", "address"];
  }

  // Which fields should be indexed on Elasticsearch
  get search() {
    return ["name", "surname", "address"];
  }
}

export default User;
```

:::

:::tip
As you can see in the example, you don't have to index all fields.
:::

After the model definition, Axe API creates an index on Elasticsearch by using the model name with the `search.indexPrefix` configuration automatically.

Also, Axe API **creates**, **updates**, and **deletes** the data on the index _automatically_.

## Search handler

You should use the `handlers` getter to expose the search handler to the outside world.

::: code-group

```ts{12-14} [app/v1/Models/User.ts]
import { Model, DEFAULT_HANDLERS, HandlerTypes } from "axe-api";

class User extends Model {
  get fillable() {
    return ["name", "surname", "email", "phone", "address"];
  }

  get search() {
    return ["name", "surname", "address"];
  }

  get handlers() {
    return [...DEFAULT_HANDLERS, HandlerTypes.SEARCH];
  }
}

export default User;
```

:::

After that, you can use the following endpoint to search Elasticsearch data:

::: code-group

```bash [cURL]
$ curl \
  -H "Content-Type: application/json" \
  -X GET http://localhost:3000/api/v1/users/search?text=karl
```

```json [HTTP Response]
{
  "data": [
    {
      "id": 1,
      "name": "Karl",
      "surname": "Popper",
      "email": "karl@popper.com",
      "phone": "11223344",
      "address": "The home address",
      "created_at": "2023-11-25T22:07:01.000Z",
      "updated_at": "2023-11-25T22:07:30.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "lastPage": 1,
    "per_page": 10,
    "currentPage": 1,
    "from": 0,
    "to": 10
  }
}
```

:::

:::warning
Axe API does **NOT** add the previous records to Elasticsearch when you enable the full-text search feature or change the search fields.

You **MUST** create your own script to perform that task.
:::

## Next step

Supporting a full-text search feature for a model is very simple on Axe API, but it is extendable. You should check the model reference to get more information.

In the next section, you will learn another cool stuff: Axe API Client library.
