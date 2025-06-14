# Axe API v1.2 is out!

`v1.2` comes with two important features that you can start to use.

Let's discover it more!

## Advanced hook types

Axe API provides a better type definitions for hooks.

For example, in the following hook (`onBeforeUpdate`), the query was looking like an optional variable. But for the `onBeforeUpdate`, it wasn't optional. The problem was; Axe API was using `IContext` for all hooks.

```ts
import { IContext } from "axe-api";

export default async ({ query, req }: IContext) => {
  query?.where("owner_id", req.original.auth);
};
```

With the new hooks parameter types, you can use a specific type for your hook function like the following example;

```ts
import { IBeforeUpdateContext } from "axe-api";

export default async ({ query, req }: IBeforeUpdateContext) => {
  query.where("owner_id", req.original.auth);
};
```

## Short serialization file name

Developers are be able to use the model name as the serializer name directly now.

::: code-group

```ts
`app/v1/Serialization/UserSerialization.ts`; // [!code --]
`app/v1/Serialization/User.ts`; // [!code ++]
```

:::

We can handle this change without a major version update requirement. Old naming is deprecated and it will be removed in the next major release.
