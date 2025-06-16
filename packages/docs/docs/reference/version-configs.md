# Version Configs

::: code-group

```ts [app/v1/config.ts]
import { IVersionConfig, allow, QueryFeature } from "axe-api";

const config: IVersionConfig = {
  transaction: [],
  serializers: [],
  supportedLanguages: ["en"],
  defaultLanguage: "en",
  query: {
    limits: [allow(QueryFeature.All)],
    defaults: {
      perPage: 10,
      minPerPage: 10,
      maxPerPage: 100,
    },
  },
  formidable: {},
  cache: {},
};

export default config;
```

:::

## `transactions`

The general database transaction configuration. You can use like the following examples;

::: code-group

```ts [Simple]
import { IVersionConfig } from "axe-api";

const config: IVersionConfig = {
  transaction: true, // or FALSE
};

export default config;
```

```ts [Handler-based]
import { IVersionConfig, HandlerTypes } from "axe-api";

const config: IVersionConfig = {
  transaction: {
    handler: HandlerTypes.INSERT,
    transaction: true, // or FALSE
  },
};

export default config;
```

```ts [Handler-array-based]
import { IVersionConfig, HandlerTypes } from "axe-api";

const config: IVersionConfig = {
  transaction: {
    handler: [HandlerTypes.INSERT, HandlerTypes.UPDATE],
    transaction: true, // or FALSE
  },
};

export default config;
```

```ts [Advanced]
import { IVersionConfig, HandlerTypes } from "axe-api";

const config: IVersionConfig = {
  transaction: [
    {
      handler: [HandlerTypes.INSERT, HandlerTypes.UPDATE],
      transaction: true, // or FALSE
    },
    {
      handler: [HandlerTypes.PATCH],
      transaction: false, // or TRUE
    },
  ],
};

export default config;
```

:::

## `serializers`

The general response serializer.

::: code-group

```ts [Simple]
import { IVersionConfig } from "axe-api";

const mySerializer = (data: any, request: Request) => {
  return {
    ...data,
    generatedAt: new Date()
  }
})

const config: IVersionConfig = {
  serializers: [mySerializer]
};

export default config;
```

```ts [Handler-based]
import { IVersionConfig, HandlerTypes } from "axe-api";

const mySerializer = (data: any, request: Request) => {
  return {
    ...data,
    generatedAt: new Date()
  }
})

const config: IVersionConfig = {
  serializers: [
    {
      handler: [HandlerTypes.INSERT],
      serializer: [mySerializer]
    }
  ]
};

export default config;
```

:::

## `supportedLanguages`

All supported languages by the API.

::: code-group

```ts [Simple]
import { IVersionConfig } from "axe-api";

const config: IVersionConfig = {
  supportedLanguages: ["en", "fr"],
};

export default config;
```

:::

## `defaultLanguage`

The default language if the HTTP client doesn't specify any.

::: code-group

```ts [Simple]
import { IVersionConfig } from "axe-api";

const config: IVersionConfig = {
  defaultLanguage: "en",
};

export default config;
```

:::

## `query`

The default Axe API Query Configurations.

### `query.limits`

The query limits. You can decide which query features are enabled or not.

::: code-group

```ts [Default]
import { IVersionConfig, allow } from "axe-api";

const config: IVersionConfig = {
  query: {
    limits: [allow(QueryFeature.All)],
  },
};

export default config;
```

```ts [Allow/Deny]
import { IVersionConfig, allow, deny } from "axe-api";

const config: IVersionConfig = {
  query: {
    limits: [
      allow(QueryFeature.All), // Allow all default query
      deny(QueryFeature.WithHasMany), // But deny "WithHasMany"
      deny(QueryFeature.Trashed), // But allow "Trashed"
    ],
  },
};

export default config;
```

```ts [Key-based]
import { IVersionConfig, allow, deny } from "axe-api";

const config: IVersionConfig = {
  query: {
    limits: [
      allow(QueryFeature.All), // Allow all default query features.
      deny(QueryFeature.Sorting), // Deny sorting
      allow(QueryFeature.Sorting, ["id"]), // Allow sorting by only `id` fields
    ],
  },
};

export default config;
```

:::

### `query.default`

The default query parameters.

::: code-group

```ts [Default]
import { IVersionConfig } from "axe-api";

const config: IVersionConfig = {
  query: {
    defaults: {
      perPage: 10,
      minPerPage: 10,
      maxPerPage: 100,
    },
  },
};

export default config;
```

:::

- `perPage`: The default "per page" value if the HTTP client doesn't specify.
- `minPerPage`: The minimum "per page" value.
- `maxPerPage`: The maximum "per page" value.

## `formidable`

The default `formidable` options.

You can use all options by the [documentation](https://github.com/node-formidable/formidable#options)

## `cache`

You can override the general cache configuration for a specific version.

:::tip
Check the [Cache Configs](/reference/cache-configs) out.
:::
