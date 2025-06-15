# IoC

**Inversion of Control** (IoC) is a design principle (although, some people refer to it as a pattern). As the name suggests, it is used to invert different kinds of controls in object-oriented design to achieve loose coupling. <a href="https://www.tutorialsteacher.com/ioc/inversion-of-control" target="_blank" rel="noreferrer">[\*]</a>

Axe API provides a simple IoC structure to create testable codes. Let's review the following hook;

```ts
import { IContext } from "axe-api";

const onBeforeInsert = async ({ formData }: IContext) => {
  // formData.email: the new user's email address
  // TODO: Check if the email is already used
};

export { onBeforeInsert };
```

Let's assume that we want to check if the email is already used in the database. To do that, we need a database connection. But Axe API already has a database connection. With IoC, you can use the database connection like the following example;

```ts
import { IoCService, IContext } from "axe-api";
import { Knex } from "knex";

const onBeforeInsert = async ({ formData }: IContext) => {
  const db = await IoCService.use<Knex>("Database");
  const user = await db.table("users").where("email", formData.email).first();
};

export { onBeforeInsert };
```

As you may see in the example, you can get the database connection from IoC. There are some objects which are provided by Axe API for you such as Database or Config. On the other hand, you can use the IoC to define and use your objects.

## Internal

Axe API provides the following instances for you as default.

### `Config (Singleton)`

`Config` is an instance of your application's configuration.

```ts
import { IoCService, IApplicationConfig } from "axe-api";

const onBeforePaginate = async () => {
  const Config = await IoCService.use<IApplicationConfig>("Config");
  console.log(Config.Application.env); // development
};

export { onBeforePaginate };
```

You may find more detail in the [Config](/reference/api-configs) documentation.

### `Database (Singleton)`

You can access the <a href="https://knexjs.org/#Installation-client" target="_blank" rel="noreferrer">Knex.js' connection instance</a>.

```ts
import { IoCService, IContext } from "axe-api";
import { Knex } from "knex";

const onBeforeInsert = async ({ formData }: IContext) => {
  const db = await IoCService.use<Knex>("Database");
};

export { onBeforeInsert };
```

## Extending

In Axe API, you can define your definitions. `app/v1/init.ts` file is the best place to put your definitions. Because, after Axe API analyze the application, it calls the `init` function to handle your custom logic.

You can review the following example;

```ts
import { App, IoCService, IApplicationConfig } from "axe-api";
import MyClass from "my-class";
import Mailer from "some-mail-library";

const onBeforeInit = async (app: App) => {
  // Best place to define your IoC definitions.
  IoCService.singleton("MyClass", async () => {
    return new MyClass();
  });

  IoCService.bind("Mailer", async () => {
    const Config = await IoCService.use<IApplicationConfig>("Config");
    return new Mailer(Config.SMTP);
  });
};

const onAfterInit = async (app: App) => {};

export { onBeforeInit, onAfterInit };
```

## Methods

### `async use<T>(name)`

With `use` method, you can get the instance from IoC.

```ts
import { IoCService, IContext } from "axe-api";

const onBeforeInsert = async ({ formData }: IContext) => {
  const db = await IoCService.use<MyClass>("MyClass");
};

export { onBeforeInsert };
```

### `bind(name, callback)`

With `bind` method, you can define a relationship. In this way, whenever you want to use it, your callback function will be executed again.

```ts
import { IoCService } from "axe-api";

class MyClass {}

IoCService.bind("MyClass", async () => {
  return new MyClass();
});
```

### `singleton(name, callback)`

In software engineering, the singleton pattern is a software design pattern that restricts the instantiation of a class to one "single" instance. <a href="https://en.wikipedia.org/wiki/Singleton_pattern" target="_blank" rel="noreferrer">[\*]</a> With this method, you can define a singleton relationship with your object.

```ts
import { IoCService } from "axe-api";

class MyClass {}

IoCService.singleton("MyClass", async () => {
  return new MyClass();
});
```

In this example, `IoCService.use` call, your callback function will be called only once. In the next usages, the results of your function will be returned automatically.
