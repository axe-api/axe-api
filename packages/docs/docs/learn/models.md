# What does a Model mean?

<p class="description">
In this chapter, we'll explore the magic of Axe API models. These powerful features simplify and accelerate API development, allowing developers to define the structure and behavior of their APIs quickly and easily. 
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>What does a Model mean?</li>
  <li>How does Axe API handle models?</li>
  <li>How to configure an Axe API model?</li>
  <li>How to add your custom logic?</li>
</ul>

## Fundamentals

Axe API models are a magical feature that can simplify and accelerate the development of robust and customizable APIs.

Unlike traditional **ORM models**, Axe API models offer a flexible and powerful way to define the structure and behavior of your API, without requiring developers to write complex and time-consuming code.

By defining a model, developers can specify how data should be stored, retrieved, updated, and deleted. When a model is saved, Axe API analyzes it and **_creates routes automatically_** based on the model's structure and configuration.

This means that developers can focus on building their API's business logic rather than worrying about the low-level details of handling requests and responses.

## Basic model example

To illustrate the magic of Axe API models, consider the following example:

```ts
import { Model } from "axe-api";

class User extends Model {}

export default User;
```

This simple model generates routes for CRUD (_Create, Read, Update, Delete_) operations on users automatically, without requiring any additional code.

Specifically, the following routes are created:

- `GET api/v1/users`: Retrieve a paginated list of all users
- `POST api/v1/users`: Create a new user
- `GET api/v1/users/:id`: Retrieve a user by ID
- `PUT api/v1/users/:id`: Update a user by ID
- `DELETE api/v1/users/:id`: Delete a user by ID

By default, Axe API generates routes for CRUD operations based on the structure of the model. However, developers can customize the routes by adding additional configurations, which makes Axe API models even more powerful.

Overall, the magic of Axe API models lies in their ability to simplify and automate the development of APIs, allowing developers to focus on building the core logic of their application.

With Axe API models, developers can create robust and customizable APIs in less time and with less effort than ever before.

## How to configure a model?

Axe API's model configurations provide a **_declarative way_** to define the behavior of your API.

In the example below, we have defined the `Users` model and set the `fillable` property to include only the `name` and `surname` fields. This means that any data sent by HTTP clients with additional fields will be automatically discarded by the API, except the `name` and `surname` fields.

```ts
import { Model } from "axe-api";

class Users extends Model {
  get fillable() {
    return ["name", "surname"];
  }

  get validations() {
    return {
      name: "required|max:50",
      surname: "required|max:50",
    };
  }
}

export default User;
```

We have also defined data validation rules using the `validations` property. This ensures that any data sent by HTTP clients must meet the defined rules before it is accepted and processed by the API. This prevents the API from processing invalid data and **guarantees** that all responses are **consistent**.

One of the great advantages of using Axe API models is that you no longer need traditional **Controller** files. Axe API handles all the requests automatically based on your models, making development faster and more efficient.

:::tip
It's worth noting that all model configurations are `getters`.

In the future, this will allow developers to define model configurations in `YAML` or `JSON` formats, making the API even easier to configure and maintain.
:::

Overall, Axe API model configurations are a powerful and flexible way to define the behavior of your API. With a little bit of configuration, you can ensure that your API works as you want, without the need for complex controllers.

## Customize logic

As you can see, Axe API creates and handles your API automatically. But it may not be enough for most scenarios. As developers, we should be able to add custom logic to our APIs.

Axe API allows developers to add custom logic in many different ways. We will discuss each method in the following sections. However, here we will summarize the basic understanding.

Axe API uses **events** for every HTTP action, such as _before inserting data_, _after inserting data_, _before paginating_, _after paginating_, etc. For every HTTP request handling process, there are many **events** that developers can use in their code.

Axe API has two different categories of **events** by their `async`/`sync` status: `hooks` and `events`.

Hooks work as **synchronous** with the HTTP requests, but events work **asynchronously**.

Let's take a look at the following example. In the following function, the `password` field is hashed using the `bcrypt` library:

```ts
import bcrypt from "bcrypt";
import { IContext } from "axe-api";

export default async ({ formData }: IContext) => {
  formData.password = bcrypt.hashSync(formData.password, 10);
};
```

If you save this file as `app/v1/Hooks/User/onBeforeInsert.ts` in your codebase, Axe API will execute your **hook function** before inserting a new record on `users` table via `User` model.

Using this method, you can add any custom logic to your API **request life-cycle**. For example, you can add validation rules or enrich the request data by integrating with external services.

:::tip
Also, hook and event functions are independent functions that can be tested easily via unit tests.
:::

## Next step

In this section, we tried to understand the fundamentals of Axe API models. In this next chapter, we will think about how to manage your API routes by using model definitions.
