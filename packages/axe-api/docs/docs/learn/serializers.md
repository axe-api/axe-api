# Serializers

<p class="description">
Serializer functions are the last step of the HTTP Request-Response cycle. In this section, we will provide all information about serializers.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>What is a serializer?</li>
  <li>How to define a serializer for a model?</li>
  <li>How to define a serializer by handler type?</li>
  <li>How to define a global serializer?</li>
</ul>

## Getting started

A **serializer** function is just a simple function that takes two arguments (`data` and `request`) and returns the record item.

Let's check the following example;

```ts
import { AxeRequest } from "axe-api";

const mySerializer = (data: any, request: AxeRequest) => {
  // do something
  return data;
};
```

As you can see, the function is not an `async` function. Axe API doesn't allow to use `async` function for a serializer function.

The `data` variable means the record item by model. For example, if you are defining a _model-based_ serializer for the `User` model, Axe API sends you a record from the `users` table via the `data` parameter.

The `request` variable is an instance of [AxeRequest](/reference/axe-request).

You can change the `data` context by using a serializer function.

For example; you can add a **computed field** for each item. Let's assume that the user model has two fields on the database table; `name` and `surname`. You can create a new field that is called `fullname` by using a serializer function.

::: code-group

```json [Raw User]
{
  "id": 1,
  "name": "John",
  "surname": "Locke"
}
```

```ts [app/v1/Serialization/User.ts]
import { AxeRequest } from "axe-api";

export default (item: any, request: AxeRequest) => {
  return {
    ...item,
    fullname: `${item.name} ${item.surname}`,
  };
};
```

```json [Serialized User]
{
  "id": 1,
  "name": "John",
  "surname": "Locke",
  "fullname": "John Locke"
}
```

:::

## Global serializer

You can define a version-based serializer function in the version config file. That kind of serializer function works in every HTTP request that returns a response.

::: code-group

```ts [app/v1/config.ts]
import { AxeRequest } from "axe-api";
import { IVersionConfig } from "axe-api";

const simpleSerializer = (data: any, request: AxeRequest) => {
  data.signed = true;
  return data;
};

const config: IVersionConfig = {
  serializers: [simpleSerializer],
};

export default config;
```

:::

In the example above, we defined a global serializer function. This means that function will be triggered by all model items.

## Model-based serializer

You can define a specific serializer for a specific model like the following example;

::: code-group

```ts [app/v1/Serialization/User.ts]
import { AxeRequest } from "axe-api";

export default (item: any, request: AxeRequest) => {
  return {
    ...item,
    fullname: `${item.name} ${item.surname}`,
  };
};
```

```json [HTTP Response]
{
  "id": 1,
  "name": "John",
  "surname": "Locke",
  "fullname": "John Locke"
}
```

:::

This serializer is used for all user responses. For example in _user pagination_, _fetching a user_, and _updating a user_.

Also, all relational queries use \*model-based serialization\*\*. This means that your user responses will have the same response structures in all requests.

## Handler-based serializer

In the version configuration file, you can define a handler-based serializer. Those kinds of serializers are used for all handler types like all paginations, etc.

You can define a handler-based serializer function, like the following example.

::: code-group

```ts [app/v1/config.ts]
import { AxeRequest } from "axe-api";
import { IVersionConfig, HandlerTypes } from "axe-api";

const simpleSerializer = (data: any, request: AxeRequest) => {
  data.signed = true;
  return data;
};

const config: IVersionConfig = {
  serializers: [
    {
      handler: [HandlerTypes.PAGINATE],
      serializer: [simpleSerializer],
    },
  ],
};

export default config;
```

:::

In the example above, we defined the `simpleSerializer` for all `PAGINATE` handlers. All `PAGINATE` handlers will be using the serializer function.

## Next steps

In this section, we have talked about serializers and shown some examples.

In the next chapter, we are going to talk about configurations.
