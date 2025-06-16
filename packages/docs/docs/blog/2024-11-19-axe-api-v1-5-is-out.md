# Axe API v1.5 is out!

`v1.5` comes with one feature and a security upgrades.

Let's discover it more!

## `createRateLimitMiddleware()`

A new function has been added to the Axe API; `createRateLimitMiddleware`.

You can define a custom rate-limit middleware as the following definition:

```ts
import { createRateLimitMiddleware } from "axe-api";

const myRateLimitter = (req: IncomingMessage, res: ServerResponse, next: any) =>
  createRateLimitMiddleware(req, res, next, "user-identifier", {
    maxRequests: 2,
    windowInSeconds: 10,
  });

const onBeforeInit = async (app: App) => {
  app.use(myRateLimitter);
};
```

## Disabling `x-powered-by` response header

A new configuration parameter has been added. Now, you can disable `x-powered-by` header by using `disableXPoweredByHeader` value.

```ts
const config: IApplicationConfig = {
  // ...
  disableXPoweredByHeader: false,
  // ...
};
```

## Custom relationship query hooks

You can define a `onBeforeQuery` hook for `hasMany` relationship definitions. By using that function, you can limit, or add more conditions as we wish.

```ts
const onBeforeViewQuery = async (req: AxeRequest, query: Knex.QueryBuilder) => {
  query.orderBy("id", "desc");
};

class Post extends Model {
  views() {
    return this.hasMany("PostView", "id", "post_id", {
      onBeforeQuery: onBeforeViewQuery,
    });
  }
}
```

## Missing hooks/events on patching

`PATCH` hooks and events weren't working as expected. They were using the wrong hooks/events functions.

The following hooks/events definitions are added:

- `onBeforePatchQuery`
- `onBeforePatch`
- `onAfterPatchQuery`
- `onAfterPatch`

## `hostname` configuration

A new configuration parameter has been added. Now, you can set the hostname value of the server:

```ts
const config: IApplicationConfig = {
  // ...
  hostname: "127.0.0.1",
  // ...
};
```

## Bug fixes

The follwing bugs have been fixed:

- Fixed performance issues on related-data queries. [#585](https://github.com/axe-api/axe-api/issues/585)
- Fixed query limit issue [#587](https://github.com/axe-api/axe-api/issues/587)
- Fixed model serialization function doesn't work on ALL handlers issue. [#588](https://github.com/axe-api/axe-api/issues/588)
