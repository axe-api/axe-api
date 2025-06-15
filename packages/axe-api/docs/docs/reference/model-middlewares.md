# Model.`middlewares()`

Sometimes, you may want to protect your models by requests. In those cases, you can use model-based middleware.

Axe API supports 3 different middleware function types:

- `PhaseFunction`
- `HandlerFunction`
- `MiddlewareFunction`

## `PhaseFunction`

You can use a `PhaseFunction` that supports `IContext`.

```ts
import { Model, IContext } from "axe-api";

class User extends Model {
  get middlewares() {
    return [
      (context: IContext) => {
        // Check anything you want here.
      },
    ];
  }
}

export default User;
```

## `HandlerFunction`

You can use a `HandlerFunction` that supports `AxeRequest` and `AxeResponse`.

In this kind of middleware function, you don't need to use the `next()` function.

```ts
import { Model, AxeRequest, AxeResponse } from "axe-api";

class User extends Model {
  get middlewares() {
    return [
      (request: AxeRequest, response: AxeResponse) => {
        // Check anything you want here.
      },
    ];
  }
}

export default User;
```

## `MiddlewareFunction`

We are expecting you to define basically an [connect middleware](https://github.com/senchalabs/connect#use-middleware).

To do add a middleware to a model handlers, you should use `middlewares` getter like the following code;

```ts
import { IncomingMessage, ServerResponse } from "http";
import { Model, NextFunction } from "axe-api";

class User extends Model {
  get middlewares() {
    return [
      (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
        // Check anything you want here.
        next();
      },
    ];
  }
}

export default User;
```

## Deciding the function type

We suggest using `PhaseFuction` if you can because `IContext` provides data that you can use such as the current model, transaction object if there is any, etc.

Otherwise, you can use `HandlerFunction`. `AxeRequest` provides the current language option. Also, this kind of function is easy to use because there is no `next()` function that you should invoke.

`MiddlewareFunction` should be the last choice. We support it because some [connect middlewares](https://github.com/senchalabs/connect#middleware) are compatible with that type.

## Multiple middlewares

As you can see, you should return an array. It has been designed like that because it helps us to add multiple middlewares at the same time. With the code above, your middleware list will be executed in orderly for all allowed handlers.

Of course, you can use multiple middleware functions from other files;

```ts
import { Model } from "axe-api";
import { isAdmin, isLogged } from "./../Middlewares/index";

class User extends Model {
  get middlewares() {
    return [isLogged, isAdmin];
  }
}

export default User;
```

## Handler-based middlewares

But that is not enough for us. We aimed to create a very flexible structure for you. That's why, we added a feature that you can add a special middleware function for a special handler.

```ts
import { Model, HandlerTypes } from "axe-api";
import { isAdmin, isLogged } from "./../Middlewares/index";
const { INSERT, PAGINATE, UPDATE, DELETE } = HandlerTypes;

class User extends Model {
  get middlewares() {
    return [
      {
        handler: [INSERT, PAGINATE, UPDATE],
        middleware: isLogged,
      },
      {
        handler: [DELETE],
        middleware: isAdmin,
      },
    ];
  }
}

export default User;
```

In this example, this second middleware will be executed only for **DELETE** handler. This is a great way to create a very flexible architecture. Also, it helps us to separate common API logic (CRUD) from business logic.
