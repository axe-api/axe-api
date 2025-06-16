# Model.`search()` <Badge type="warning" text="experimental" />

:::warning
Currently, the full-text search feature is **EXPERIMENTAL**.

Still, we strongly suggest to use it in some little parts of your application.
:::

You can decide which fields should be indexed on Elasticsearch.

:::tip
You can find more information in [Full-text search](/learn/full-text-search) section.
:::

:::tip
You should review the [Elasticsearch Configs](/reference/elastic-search-configs) and the [Search Configs](/reference/search-configs)
:::

For example, in the following example, only the `name` and `surname` fields will be indexed on the Elasticsearch.

::: code-group

```ts{8-10} [app/v1/Models/User.ts]
import { Model } from "axe-api";

class User extends Model {
  get fillable() {
    return ["name", "surname", "email"];
  }

  get search() {
    return ["name", "surname"];
  }
}

export default User;
```

:::

After that definition:

- Axe API creates the indexes automatically in the initialization process.
- Axe API saves, updates, and deletes the data on the index by using the primary key.

:::warning
You MUST activate the [SEARCH](/reference/handlers-search-handler) handler to allow HTTP clients are able to use the full-text search feature.
:::

:::tip
You can manipulate the search query by overriding the [getSearchQuery()](/reference/model-get-search-query) function.
:::
