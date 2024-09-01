# `ApiError`

ApiError class is designed to send errors to the HTTP client easily. You can use it in any hooks.

You can check the following example;

::: code-group

```ts [app/v1/Hooks/User/onBeforeInsert.ts]
import { IContext, ApiError, StatusCodes } from "axe-api";

export default async (parameters: IContext) => {
  throw new ApiError(
    "This is not an acceptable request!",
    StatusCodes.BAD_REQUEST,
  );
};
```

:::

By this example, you can get the following error in the HTTP response body;

::: code-group

```bash [cURL Request]
curl \
  -H "Content-Type: application/json" \
  -X POST http://localhost:3000/api/v1/users
```

```json [Response [400]]
{
  "error": "This is not an acceptable request!"
}
```

:::
