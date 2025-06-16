# `resource()`

You can set the resource URL.

```ts
import api from "axe-api-client";

// ...
api.resource("users");
```

- `url`: The resource URL.

After this, you should call at least one of the following functions to send an HTTP request:

- `insert()`
- `update()`
- `patch()`
- `delete()`
- `paginate()`
