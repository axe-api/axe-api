# Model.`getSearchQuery()` <Badge type="warning" text="experimental" />

:::warning
Currently, the full-text search feature is **EXPERIMENTAL**.

Still, we strongly suggest to use it in some little parts of your application.
:::

Axe API creates the Elasticsearch query automatically on the SEARCH handler.

But you can override the `getSearchQuery()` method and decide the searching query by your custom logic.

:::warning
This function is used only if you activate the [SEARCH](/reference/handlers-search-handler) handler in your API.
:::

## Default search query

By default, Axe API adds 4 important things to the query. You can check the following query example.

:::warning

Understanding the query is very important to create a custom query.
:::

```json
{
  "query": {
    "bool": {
      "must": [
        {
          "query_string": {
            "query": "*karl*",
            "analyze_wildcard": true
          }
        }
        {
          "term": {
            "role_id": 1
          }
        }
      ],
      "must_not": { "exists": { "field": "deleted_at" } }
    }
  },
  "sort": [
    {
      "_score": { "order": "desc" }
    }
  ]
}
```

### Full-text search

Full-text search value is the crucial part of the query. Let's assume that an HTTP client sends a request like the following one:

::: code-group

```bash [cURL]
$ curl \
  -H "Content-Type: application/json" \
  -X GET http://localhost:8080/api/v1/roles/1/users/search?text=karl
```

:::

Axe API adds the following part to the query:

```json
{
  "query_string": {
    "query": "*karl*",
    "analyze_wildcard": true
  }
}
```

### Parent id check

Let's assume that the `User` model has a one-to-one relationship with the `Role` model, and you are searching the users under a specific model (`roles/1/users`).

In this case, Axe API adds the relationship checks to the query like the following example:

```json
{
  "term": {
    "role_id": 1
  }
}
```

:::tip
Axe API saves the relationship values to the indexes automatically even though they are not defined on the `search()` function.
:::

### Soft delete check

Axe API adds the soft delete checks to the Elasticsearch query automatically if you set up the soft delete feature on the model file.

```json
{
  "must_not": {
    "exists": { "field": "deleted_at" }
  }
}
```

### Sorting by the score

By default, Axe API uses the score value provided by Elasticsearch to sort results. That's why the following part is added to the query.

```json
{
  "sort": [
    {
      "_score": { "order": "desc" }
    }
  ]
}
```

## Custom query

You can use the `getSearchQuery()` function to generate your custom query.

:::tip

Understanding the [Default search query](/reference/model-get-search-query#default-search-query) is very important to create a custom query.
:::

::: code-group

```ts [app/v1/Models/User.ts]
import { IElasticSearchParameters, Model } from "axe-api";

class User extends Model {
  getSearchQuery(params: IElasticSearchParameters) {
    const query = {};

    // generate the Elasticsearch query here

    return query;
  }
}

export default User;
```

```ts [IElasticSearchParameters.ts]
interface IElasticSearchParameters {
  req: AxeRequest;
  model: IModelService;
  relation: IRelation | null;
  parentModel: IModelService | null;
  text: string;
}
```

::: code-group

`IElasticSearchParameters` interface has the following items to help you to create an Elasticsearch query:

- text: `string`
- req: HTTP request object. See [AxeRequest](/reference/axe-request#axerequest).
- model: The current model object. See [IModelService](/reference/icontext#model).
- relation: The parent relation if there is any. See [IRelation](/reference/icontext#relation).
- parentModel: The parent model if there is any. See [IModelService](/reference/icontext#model).

:::tip
You can check the [Modal.ts](https://github.com/axe-api/axe-api/blob/master/src/Model.ts) file to see how Axe API handles generating Elasticsearch queries.

:::
