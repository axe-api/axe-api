# `setConfig()`

```ts
import api from "axe-api-client";

api.setConfig({
  baseURL: "https://your-domain.com/api/v1",
  headers: {
    "x-my-common-header": "my-value",
  },
  params: {},
});
```

- `baseURL`: The main URL of the Axe API server. You can add the version name if you want.
- `headers`: The default headers that you want to add.
- `params`: The default params that you want to add.
