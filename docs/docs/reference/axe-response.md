# AxeResponse

`AxeResponse` is the response object that you can use in events, hooks and middlewarees.

For example;

```ts
import { IContext } from "axe-api";

export default async (context: IContext) => {
  const { res } = context;
};
```

## `status`

Sets the HTTP response status.

```ts
import { IContext } from "axe-api";

export default async ({ res }: IContext) => {
  res.status(404);
};
```

## `json`

Sets the HTTP response data as `JSON`.

```ts
import { IContext } from "axe-api";

export default async ({ res }: IContext) => {
  res.status(400).json({
    error: "Bad request!",
  });
};
```

## `send`

Sets the HTTP response data as `string`.

```ts
import { IContext } from "axe-api";

export default async ({ res }: IContext) => {
  res.status(400).send("Bad request");
};
```

## `header`

Sets the HTTP response header value.

```ts
import { IContext } from "axe-api";

export default async ({ res }: IContext) => {
  res.header("X-Custom-Key", "My custom header value");
};
```

## `noContent`

Sets the [204 No Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204) response.

```ts
import { IContext } from "axe-api";

export default async ({ res }: IContext) => {
  res.noContent();
};
```

## `original`

Gets the original HTTP response object.

```ts
import { IContext } from "axe-api";
import { ServerResponse } from "http";

export default async ({ res }: IContext) => {
  const original: ServerResponse = res.original;
};
```
