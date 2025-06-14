# Defaults

A handler represents an HTTP request behavior something like inserting data, listing records or etc. Axe API has common HTTP request behaviors as default but the developer is able to decide what kind of handler is enabled. In this section, we are going to look closer at the handlers.

In your models, you can set which handlers should be enabled;

```ts
import { Model, HandlerTypes } from "axe-api";
const { INSERT, SHOW, UPDATE, DELETE, FORCE_DELETE, PAGINATE, PATCH, ALL } =
  HandlerTypes;

class User extends Model {
  get handlers() {
    return [INSERT, SHOW, UPDATE, DELETE, FORCE_DELETE, PAGINATE, PATCH, ALL];
  }
}

export default User;
```

Axe API has the following handlers;

- INSERT
- PAGINATE
- SHOW
- UPDATE
- DELETE
- FORCE_DELETE (Only with [Soft Delete](/reference/model-deleted-at-column) feature)
- PATCH
- ALL

Axe API uses the following handlers as default handlers for all models;

- INSERT
- PAGINATE
- SHOW
- UPDATE
- PATCH
- DELETE

But you can extend a models' default handlers like the following example;

```ts
import { Model, DEFAULT_HANDLERS, HandlerTypes } from "axe-api";

class User extends Model {
  get handlers(): HandlerTypes[] {
    return [...DEFAULT_HANDLERS, HANDLERS.ALL];
  }
}

export default User;
```

In this example, User Model will have all default handlers but plus `ALL` handler.
