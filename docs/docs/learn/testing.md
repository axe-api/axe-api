# Testing

<p class="description">
Axe API provides a test-friendly development environment since it provides a clean & independent structure. In this section, we are going to show the basics.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>How to write unit tests?</li>
  <li>How to use the internal dependency injection mechanism?</li>
</ul>

## Overview

As Axe API, we want to use internal codes for the **CRUD** operations. Also, we want to provide some escape points such as [Hooks](/learn/hooks-and-events), [Events](/learn/hooks-and-events), [Middlewares](/learn/middlewares), etc. By doing that, you can yourfocus your business logic in escape points.

Let's look at the following hook;

`UserHooks.ts`

```ts
import { IContext } from "axe-api";

const onBeforeInsert = async ({
  formData,
  req,
  res,
  model,
  database,
  relation,
  parentModel,
}: IContext) => {
  // do whatever you want here...
};

export { onBeforeInsert };
```

In general, we want you don't need anything in escape points. For providing that, we are passing all possible arguments to your function. That's why this is not just a simple function. It is also a function that can be tested by unit test methods. Let's create a simple test spec in the same folder;

`UserHooks.spec.ts`

```ts
import { IContext } from "axe-api";
import { onBeforeInsert } from "./UserHooks";

describe("onBeforeInsert", () => {
  test("should be able to add timestamps", async () => {
    const formData = {
      name: "Karl Popper",
      created_at: null,
    };
    await onBeforeInsert({ formData } as IContext);
    expect(formData.created_at).not.toBe(null);
  });
});
```

As you can see, we can import the `onBeforeInsert` function directly because we don't need any other dependencies. We provide all the things. So you can just focus on what do you want to test.

Also, we added [Jest](https://jestjs.io/) library to the project for you. You can execute the following command to execute tests;

```bash
$ npm run test

> jest --runInBand --colors

 PASS  app/v1/Hooks/UserHooks.spec.js
  onBeforeInsert
    √ should be able to add timestamps (2 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.755 s
Ran all test suites.
```

That's all!

## Dependency Injection

You may think that what if I need some other dependencies such as a _mail sender_. To solve this problem, we created a simple **IoC container**. To define your relations, you should use it in the init function;

`app/v1/init.ts`

```ts
import { App, IoCService } from "axe-api";
import nodemailer from "nodemailer";

const onBeforeInit = async (app: App) => {
  IoCService.singleton("Mailer", async () => {
    return nodemailer;
  });
};

const onAfterInit = async (app: App) => {};

export { onBeforeInit, onAfterInit };
```

After that only thing, you should do is call the dependency via `IoC`;

```ts
import { IoCService, IContext } from "axe-api";

const onBeforeInsert = async ({ formData }: IContext) => {
  const mailer = await IoCService.use("Mailer");
  // do whatever you want here...
};

export { onBeforeInsert };
```

Writing the tests is easier now. You can bind your dependency in the testing function;

```ts
import { IoCService } from "axe-api";
import { onBeforeInsert } from "./UserHooks";

describe("onBeforeInsert", () => {
  test("should be able to add timestamps", async () => {
    IoCService.bind("Mailer", async () => {
      return "my-fake-mailer";
    });
    await onBeforeInsert({ formData });
  });
});
```

It is deadly simple!

## Next steps

In this next section, we showed how you can write unit test. In the next section, we are going to talk about deploment process.
