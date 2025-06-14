# Auto-caching

<p class="description">
Axe API has started to provide an auto-caching mechanism with the new version. In this section, you can learn everything about the Axe API auto-caching mechanism.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>What is caching?</li>
  <li>How does auto-caching work?</li>
  <li>How to configure the auto-caching setup?</li>
  <li>What is the time-based cache strategy?</li>
  <li>What is the tag-based cache strategy?</li>
  <li>How does Axe API solve the cache invalidation issues?</li>
</ul>

:::warning
Currently, the auto-caching feature is **EXPERIMENTAL**.

Still, we strongly suggest to use it in some little parts of your application.
:::

## What is caching?

Caching is a technique used in REST APIs to improve performance and reduce server load.

It stores copies of frequently requested data temporarily. When a client requests data, the server checks if it's in the cache. If so, it's faster to retrieve, reducing response time and server workload.

Caches have expiration times to ensure data remains fresh. This enhances API efficiency, minimizes redundant data transfer, and promotes a responsive user experience.

## Auto-caching

Axe API provides auto-caching support. This means, as a developer you don't need to manage the whole caching strategies for your endpoint. You can provide great caching support for your API by changing simple configurations.

Axe API uses [Redis](https://redis.io/) as the cache database. You have to set up the Redis connection in your configuration files.

::: code-group

```ts [app/config.ts]
import { RedisClientOptions } from "redis";
import { IApplicationConfig, CacheStrategies } from "axe-api";

const config: IApplicationConfig = {
  // ...
  redis: {
    url: "redis://127.0.0.1:6379",
  },
  // ...
};
```

:::

Axe API allows developers to define different cache configurations at the application level, version level, model level, and handler level.

You can use the following configurations to support auto-caching features for all endpoints.

::: code-group

```ts [app/config.ts]
import { IApplicationConfig, CacheStrategies } from "axe-api";

const config: IApplicationConfig = {
  // ...
  cache: {
    enable: true,
    ttl: 300,
    invalidation: CacheStrategies.TimeBased,
  },
  // ...
};
```

:::

After this configuration, all [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) handlers ([PAGINATE](/reference/handlers-paginate-handler), [ALL](/reference/handlers-all-handler), and [SHOW](/reference/handlers-show-handler)) will be cached automatically.

The caching time is `300` seconds. Also, the cache invalidation strategy will be `time-based` which means the cache data will be invalidated by **only time consumed**.

The data will be fetched via the database in the first request as expected. But in the second request, **Axe API** returns the cached data on **Redis**.

You can check the [HTTP Response Headers](https://developer.mozilla.org/en-US/docs/Glossary/Response_header) to validate if the cache hit. You can find an example HTTP response with the cURL request in the following code block.

::: code-group

```bash [Response Headers]
HTTP/1.1 200 OK
X-Axe-Api-Cache: Hit
```

```bash [cURL]
$ curl \
  -H "Content-Type: application/json" \
  -X GET http://localhost:3000/api/v1/users
```

```json [HTTP Response]
{
  "data": [
    {
      "id": 1,
      "name": "Karl",
      "surname": "Popper",
      "created_at": "2023-04-16T11:37:08.000Z",
      "updated_at": "2023-04-16T11:37:08.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "lastPage": 1,
    "perPage": 10,
    "currentPage": 1,
    "from": 0,
    "to": 1
  }
}
```

:::

## Configurations

Axe API allows developers to configure the caching in the following levels,

- 0 - Application
- 1 - Version
- 2 - Model
- 3 - Handler

:::tip
The configurations that have the bigger importance would override the others.
:::

You can find example configurations for each level in the following code blocks.

::: code-group

```ts [app/config.ts]
import { IApplicationConfig, CacheStrategies } from "axe-api";

const config: IApplicationConfig = {
  // ...
  cache: {
    enable: true,
    ttl: 100,
    invalidation: CacheStrategies.TimeBased,
  },
  // ...
};
```

```ts [app/v1/config.ts]
import { IVersionConfig, CacheStrategies } from "axe-api";

const config: IVersionConfig = {
  // ...
  cache: {
    enable: true,
    ttl: 200,
    invalidation: CacheStrategies.TimeBased,
  },
  // ...
};
```

```ts [app/v1/Models/User.ts]
import { Model, CacheStrategies } from "axe-api";

class User extends Model {
  // Model-based configuration
  get cache() {
    return {
      enable: true,
      ttl: 300,
      invalidation: CacheStrategies.TimeBased,
    };
  }
}

export default User;
```

```ts [app/v1/Models/Role.ts]
import { Model, HandlerTypes, CacheStrategies } from "axe-api";

class Role extends Model {
  // Handler-based configuration
  get cache() {
    return [
      {
        handlers: [HandlerTypes.ALL],
        cache: {
          enable: true,
          ttl: 400,
          invalidation: CacheStrategies.TimeBased,
        },
      },
    ];
  }
}

export default Role;
```

:::

## Cache invalidations

Cache Invalidation in REST APIs is the process of ensuring that cached data is updated or removed when the underlying resource changes. It's crucial for maintaining data consistency. Two common techniques are:

- `Time-Based Invalidation`: Cache entries have an expiration time. When a client requests the resource after this time, the cache fetches a fresh copy from the server. This approach is simple but may lead to stale data if the expiration time is too long.

- `Tag-Based Invalidation`: <Badge type="warning" text="experimental" /> When a resource changes, the server notifies the cache to remove or update the corresponding entry. This can be achieved using webhooks or server-sent events. It ensures real-time data consistency.

Axe API supports both cache invalidation strategies, and you can decide on a different cache invalidation strategy for different models.

In addition, the Tag-Based Invalidation is sensitive for the related data, even in the pagination results.

For example, let's assume that you are listing `orders` with the `user` data like the following example.

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "quantity": 1,
      "user": {
        "id": 1,
        "first_name": "Karl",
        "last_name": "Popper"
      }
    }
  ],
  "pagination": {
    "total": 1,
    "perPage": 10,
    "currentPage": 1
  }
}
```

In the tag-based invalidation strategy, all cached data that is related to the user would be invalidated, whenever the user (`id` = 1) is updated.

You can change the invalidation strategy by using the following `ENUM` in configurations;

```ts
enum CacheStrategies {
  TimeBased,
  TagBased,
}
```

## Next step

Axe API allows developers to API cache smoothly.

In the next section, you will learn how to add a full-text search to a model.
