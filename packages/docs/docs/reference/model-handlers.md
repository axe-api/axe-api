# Model.`handlers()`

Now we can talk about the routing features of models.

As default, all CRUD routes will be generated for a model definition. But, you can decide what route should be generated for the model with the following definition.

```ts
import { Model, HandlerTypes } from "axe-api";
const { INSERT, SHOW, UPDATE, PAGINATE } = HandlerTypes;

class User extends Model {
  get handlers() {
    return [INSERT, PAGINATE];
  }
}

export default User;
```

With handlers getter, you can select what kind of behavior will be activated for the model. The code above allows only insert and pagination. With this definition, you will get the following routes only;

| HTTP Method | Url            | Handler  | Behavior               |
| ----------- | -------------- | -------- | ---------------------- |
| GET         | `api/v1/users` | PAGINATE | Paginating all records |
| POST        | `api/v1/users` | INSERT   | Creating a new record  |

**Handlers** mean what behaviors have does the model. There are very different handlers that models can support. But also, there are many on the roadmap. You can review our the following handlers table;

- `INSERT`: Creating a new record.
- `PAGINATE`: Paginating the all record.
- `SHOW`: Showing one record by id parameter.
- `UPDATE`: Updating the record by id parameter.
- `DELETE`: Deleting the record by id parameter.
