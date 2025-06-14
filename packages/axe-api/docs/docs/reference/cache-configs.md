# Cache Configs

:::warning
Currently, the auto-caching feature is **EXPERIMENTAL**.

Still, we strongly suggest to use it in some little parts of your application.
:::

::: code-group

```ts [app/config.ts]
import { IApplicationConfig, CacheStrategies } from "axe-api";

const config: IApplicationConfig = {
  ...
  cache: {
    enable: true,
    ttl: 300,
    invalidation: CacheStrategies.TimeBased,
    cachePrefix: 'axe-api',
    tagPrefix: 'tag',
    cacheKey: (req: AxeRequest) => {
      return 'custom-cache-key'
    },
    responseHeader: 'X-Axe-API-Cache'
  }
  ...
};

export default config;
```

:::

:::tip
All configurations can be overridden by version, model, and handler-based configurations.
:::

:::tip
You can override only a specific configuration if you wish in version, model, and handler-based configurations.
:::

:::warning
You MUST set [Redis configuration](/reference/redis-configs).
:::

## `enable`

You can use this configuration to enable or disable the auto-caching across all endpoints.

The default value is `false`.

## `ttl`

The default invalidation time in seconds.

## `invalidation`

The cache invalidation strategy.

There are two times cache invalidation strategies that you can use.

```ts
enum CacheStrategies {
  TimeBased,
  TagBased,
}
```

##### `CacheStrategies.TimeBased`

In this cache invalidation strategy, cache values would be invalid after the `ttl` time automatically.

##### `CacheStrategies.TagBased` <Badge type="warning" text="experimental" />

In this strategy, the cached value would be invalidated both when after `ttl` time and the cached record is updated or deleted.

## `cachePrefix`

The cache prefix that used on all cache keys. You can use your application name.

The default value is `axe-api`

## `tagPrefix`

The tag prefix that used for all tagged items in `TagBased`` invalidation strategies.

The default value is `tag`.

Example key generation:

```ts
const cacheKey = `${cachePrefix}:${tagPrefix}:${cacheKey}`;
```

## `cacheKey`

The Axe API uses the following function to generate cache keys automatically.

You can override it and generate your custom key.

```ts
const generateCacheKeu = (req: AxeRequest) => {
  return JSON.stringify({
    url: req.url,
    method: req.method,
    headers: {
      Accept: req.header("Accept"),
      "Accept-Encoding": req.header("Accept-Encoding"),
      "Accept-Language": req.header("Accept-Language"),
      Authorization: req.header("Authorization"),
      Host: req.header("Host"),
      Origin: req.header("Origin"),
      Referer: req.header("Referer"),
      "User-Agent": req.header("User-Agent"),
    },
  });
};
```

## `responseHeader`

Axe API exposes the cache information in HTTP Response headers if it is Missed or Hit.

The default value is: `X-Axe-API-Cache`

:::tip
You should set as **NULL** if you want to hide that information.
:::
