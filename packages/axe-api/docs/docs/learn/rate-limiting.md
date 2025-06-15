# Rate limiting

<p class="description">
Axe API provides an internal rate limiter. We are going to show you an example of how you can activate the rate limiter on your application in this section.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>What is rate limiting?</li>
  <li>How to add a rate limiter?</li>
  <li>How to store the rate-limiting data?</li>
</ul>

## Getting started

**Rate limiting** in REST API refers to the practice of restricting the number of requests a client can make within a specified timeframe. It helps prevent abuse, ensures **fair resource allocation**, and **protects** the API server from **excessive traffic**.

Rate limits are typically defined as a maximum number of requests per minute, hour, or day. When the limit is exceeded, the server responds with a specific HTTP status code (e.g., _429 Too Many Requests_), indicating the client has reached the limit.

Rate limiting can be implemented using various techniques such as token bucket, sliding window, or fixed window algorithms. It promotes API stability, mitigates denial-of-service attacks, and ensures equitable access to resources for all clients while maintaining the overall API performance and availability.

## Configuration

You should enable the rate limiting via the `app/config.ts` file.

```ts
import { IApplicationConfig } from "axe-api";

const config: IApplicationConfig = {
  // ...
  rateLimit: {
    enabled: true,
    maxRequests: 240,
    windowInSeconds: 60,
    trustProxyIP: false,
    adaptor: {
      type: "memory",
    },
  },
  // ...
};
```

Then all of your endpoints will be protected by the Axe API's internal rate limiter.

## Handler-base protection

In addition, you can set a special rate limiter for a specific endpoint.

You can use the `rateLimit` middleware in your models.

::: code-group

```ts [User.ts]
import { Model, rateLimit } from "axe-api";

class User extends Model {
  get middlewares() {
    return [
      {
        handler: [INSERT],
        middleware: rateLimit({
          maxRequests: 1,
          windowInSeconds: 60 * 15, // 15 minutes
        }),
      },
    ];
  }
}
```

:::

## Storing the data

Axe API supports memory and [Redis](https://redis.io/) to store rate limit data. You can change the adaptor via the configuration file.

::: code-group

```ts [app/config.ts]
import { IApplicationConfig } from "axe-api";

const config: IApplicationConfig = {
  // ...
  rateLimit: {
    enabled: true,
    maxRequests: 240,
    windowInSeconds: 60,
    trustProxyIP: false,
    adaptor: {
      type: "redis",
      redis: {
        host: "localhost",
        port: 6379,
        password: "",
        db: "",
      },
    },
  },
  // ...
};
```

:::

## Next steps

In this section, we tried to simplify how you can add your rate-limiting features to the API.

In the next section, we are going to show how you can write unit test.
