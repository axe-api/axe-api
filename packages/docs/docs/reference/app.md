# App

`App` is the fundamental Axe API application instance.

You can access it via init functions like the following example;

::: code-group

```ts [app/v1/init.ts]
import { App } from "axe-api";

const onBeforeInit = async (app: App) => {
  // your logic
};

const onAfterInit = async (app: App) => {
  // your logic
};

export { onBeforeInit, onAfterInit };
```

:::

## `use`

Adds a general middleware function to your API.

::: code-group

```ts [app/v1/init.ts]
import { App, NextFunction } from "axe-api";
import { IncomingMessage, ServerResponse } from "http";

const onBeforeInit = async (app: App) => {
  app.use((req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
    // your middleware function
    next();
  });
};

const onAfterInit = async (app: App) => {};

export { onBeforeInit, onAfterInit };
```

:::

## `get`

Creates a `GET` request.

::: code-group

```ts [app/v1/init.ts]
import { App, AxeRequest, AxeResponse } from "axe-api";

const onBeforeInit = async (app: App) => {
  app.get("api/v1/custom-handler", (req: AxeRequest, res: AxeResponse) => {
    // Custom handler
  });
};

const onAfterInit = async (app: App) => {};

export { onBeforeInit, onAfterInit };
```

```ts [App Reference]
class App {
  // ...

  public get(url: string, ...args: GeneralFunction[]) {
    // Implementation
  }

  // ...
}
```

```ts [Types]
import { AxeRequest, AxeResponse, NextFunction } from "axe-api";
import { IncomingMessage, ServerResponse } from "http";

export type GeneralFunction = MiddlewareFunction | HandlerFunction;

export type MiddlewareFunction = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction,
) => void | Promise<void>;

export type HandlerFunction = (
  request: AxeRequest,
  response: AxeResponse,
) => void | Promise<void>;
```

:::

## `post`

Creates a `POST` request.

::: code-group

```ts [app/v1/init.ts]
import { App, AxeRequest, AxeResponse } from "axe-api";

const onBeforeInit = async (app: App) => {
  app.post("api/v1/custom-handler", (req: AxeRequest, res: AxeResponse) => {
    // Custom handler
  });
};

const onAfterInit = async (app: App) => {};

export { onBeforeInit, onAfterInit };
```

```ts [App Reference]
class App {
  // ...

  public get(url: string, ...args: GeneralFunction[]) {
    // Implementation
  }

  // ...
}
```

```ts [Types]
import { AxeRequest, AxeResponse, NextFunction } from "axe-api";
import { IncomingMessage, ServerResponse } from "http";

export type GeneralFunction = MiddlewareFunction | HandlerFunction;

export type MiddlewareFunction = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction,
) => void | Promise<void>;

export type HandlerFunction = (
  request: AxeRequest,
  response: AxeResponse,
) => void | Promise<void>;
```

:::

## `put`

Creates a `PUT` request.

::: code-group

```ts [app/v1/init.ts]
import { App, AxeRequest, AxeResponse } from "axe-api";

const onBeforeInit = async (app: App) => {
  app.put("api/v1/custom-handler", (req: AxeRequest, res: AxeResponse) => {
    // Custom handler
  });
};

const onAfterInit = async (app: App) => {};

export { onBeforeInit, onAfterInit };
```

```ts [App Reference]
class App {
  // ...

  public get(url: string, ...args: GeneralFunction[]) {
    // Implementation
  }

  // ...
}
```

```ts [Types]
import { AxeRequest, AxeResponse, NextFunction } from "axe-api";
import { IncomingMessage, ServerResponse } from "http";

export type GeneralFunction = MiddlewareFunction | HandlerFunction;

export type MiddlewareFunction = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction,
) => void | Promise<void>;

export type HandlerFunction = (
  request: AxeRequest,
  response: AxeResponse,
) => void | Promise<void>;
```

:::

## `patch`

Creates a `PATCH` request.

::: code-group

```ts [app/v1/init.ts]
import { App, AxeRequest, AxeResponse } from "axe-api";

const onBeforeInit = async (app: App) => {
  app.patch("api/v1/custom-handler", (req: AxeRequest, res: AxeResponse) => {
    // Custom handler
  });
};

const onAfterInit = async (app: App) => {};

export { onBeforeInit, onAfterInit };
```

```ts [App Reference]
class App {
  // ...

  public get(url: string, ...args: GeneralFunction[]) {
    // Implementation
  }

  // ...
}
```

```ts [Types]
import { AxeRequest, AxeResponse, NextFunction } from "axe-api";
import { IncomingMessage, ServerResponse } from "http";

export type GeneralFunction = MiddlewareFunction | HandlerFunction;

export type MiddlewareFunction = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction,
) => void | Promise<void>;

export type HandlerFunction = (
  request: AxeRequest,
  response: AxeResponse,
) => void | Promise<void>;
```

:::

## `delete`

Creates a `DELETE` request.

::: code-group

```ts [app/v1/init.ts]
import { App, AxeRequest, AxeResponse } from "axe-api";

const onBeforeInit = async (app: App) => {
  app.delete("api/v1/custom-handler", (req: AxeRequest, res: AxeResponse) => {
    // Custom handler
  });
};

const onAfterInit = async (app: App) => {};

export { onBeforeInit, onAfterInit };
```

```ts [App Reference]
class App {
  // ...

  public get(url: string, ...args: GeneralFunction[]) {
    // Implementation
  }

  // ...
}
```

```ts [Types]
import { AxeRequest, AxeResponse, NextFunction } from "axe-api";
import { IncomingMessage, ServerResponse } from "http";

export type GeneralFunction = MiddlewareFunction | HandlerFunction;

export type MiddlewareFunction = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction,
) => void | Promise<void>;

export type HandlerFunction = (
  request: AxeRequest,
  response: AxeResponse,
) => void | Promise<void>;
```

:::
