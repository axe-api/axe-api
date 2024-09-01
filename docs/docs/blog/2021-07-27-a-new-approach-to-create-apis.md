# A new approach to create APIs

I wanted to put a very simple question on the table;

> Could be there a new approach to create APIs quicker?

## The Classical Way

Usually, we use some frameworks to create APIs even though they are actually MVC frameworks. Or, if you are a Node.js developer, you can start with a simple Express server. We can pick many different libraries and tools. But, we have two different tasks while developing an API; implementing the business logic and coding the same stuff over and over again.

After so many years, I asked myself that can I create a robust structure that handles all common features for an API. I mean, a different way or a method…

## Same and Different Things

Let’s think about the APIs which you have been created in your career. Probably, they have some common patterns. At least, an entity -a user entity- should have basic CRUD actions. Also, I am pretty sure that somewhere you need some extended query function on that entity. But it is not simply that. There are several design patterns to use on API designs. We are trying to implement them all as much possible as we can so that we can have good, solid APIs.

Nevertheless, nobody will use the same API because we have different business logic. So, we should put a breakpoint somewhere to split business logic and shared features.

After those thoughts, I came up with an idea, which I am working on currently.

## Define First

Let’s think about a user entity. For that entity, you may want different things. For example, you may want the following features;

- Creating a simple CRUD
- Allowing only specific fields for creation and update requests.
- Using some form validations to be sure the user sent the correct data.
- Hiding some secret data from the user such as password hash.
- Developing extended query features.
- Applying some special business logic to the creation process.
- etc.

You may add more things to this list but it would be enough to understand my idea. To create an API for the user entity, let’s create a model file.

```ts
class User {
  get fillable() {
    return ["email", "name"];
  }

  get validations() {
    return {
      email: "required|email",
      name: "required",
    };
  }
}
```

This is not an ORM model. It is just a definition of what we want as default features. What if after you create that model, you can get fully working APIs, just by your definition?

Well, I have been working for a long time to create something like this. It is name Axe API, a new way to create Rest APIs quickly.

Axe API expects model definitions from you. Axe API provides a robust, working API when you define models with their features such as validation rules, fillable fields, selected handlers (CRUD), relationships between each other. But not just that. It provides you many escape points to implement your business logic in every step of an HTTP request. As a result of the magic, you can have very extended query features for every model that you have.

## Getting Started

Let’s look closer and think of a simple model like this;

```ts
import { Model } from "axe-api";

class User extends Model {}

export default User;
```

Congrats. You have created your API! That’s easy, right? Now you have the basic CRUD requests.

But, let’s add more features. Let’s select which fields would be filled by users.

```ts
class User extends Model {
  get fillable() {
    return {
      POST: ["email", "name"],
      PUT: ["name"],
    };
  }
}
```

We didn’t just select which fields are fillable. We also selected which fields are fillable in which HTTP requests. Your creating and updating requests are secure now.

Let’s go one step further, and add form validations rules for creation.

```ts
class User extends Model {
  get fillable() {
    return {
      POST: ["email", "name"],
      PUT: ["name"],
    };
  }

  get validations() {
    return {
      email: "required|email",
      name: "required|max:50",
    };
  }
}
```

That’s it. Users should send the correct data.

But now, it is time to think deeper. What if you have two related models such as users and posts. Let’s bind them together in the model definition.

```ts
class User extends Model {
  posts() {
    return this.hasMany("Post", "id", "user_id");
  }
}

class Post extends Model {
  user() {
    return this.belongsTo("User", "user_id", "id");
  }
}
```

After that definition, Axe API will create all related routes for you. Can you believe that you will have the following routes automatically?

- `GET api/users`
- `POST api/users`
- `GET api/users/:id`
- `PUT api/users/:id`
- `DELETE api/users/:id`
- `GET api/users/:usedId/posts`
- `POST api/users/:usedId/posts`
- `GET api/users/:usedId/posts/:id`
- `PUT api/users/:usedId/posts/:id`
- `DELETE api/users/:usedId/posts/:id`

## Business Logic

Probably I can hear you say that “Yeah, it looks nice but we have different kinds of logic. For example, in user creation, I should be able to salt the password.”

But the thing you don’t know is Axe API provides hooks for every level of an HTTP request. Let’s create a UserHooks.js file for the model like this;

```js
import bcrypt from "bcrypt";

const onBeforeInsert = async ({ formData }) => {
  // Genering salt
  formData.salt = bcrypt.genSaltSync(10);
  // Hashing the password
  formData.password = bcrypt.hashSync(formData.password, salt);
};

export { onBeforeInsert };
```

This function would be triggered by Axe API before the creation process. But not just that. Axe API provides you all the following hooks;

- onBeforeInsert
- onBeforeUpdateQuery
- onBeforeUpdate
- onBeforeDeleteQuery
- onBeforeDelete
- onBeforePaginate
- onBeforeShow
- onAfterInsert
- onAfterUpdateQuery
- onAfterUpdate
- onAfterDeleteQuery
- onAfterDelete
- onAfterPaginate
- onAfterShow

## Extended Query Features

I said before that you can have many benefits to create a framework like this. For example; extended queries. Once you define your model, it would be ready to be queried. You can send a query like the following one;

```bash
GET /api/users
  ?q=[[{"name": "John"}],[{"$or.age.$gt": 18}, {"$and.id": 666 }]]
  &fields:id,name,surname
  &sort=surname,-name
  &with=posts{comments{id|content}}
  &page=2
  &per_page=25
```

With this query, you ask the following things;

- Get data if the name is "John" OR age is greater than 18 and the id is 666.
- Returns only id, name, and surname fields.
- Sort by surname first (ASC), name second (DESC).
- Get the related posts data, with the related comments data. But in comments object, just fetch id and content fields.
- Fetch 25 row per page.
- Fetch the 2 page.

Whenever you create a model, you can have these extended query features. You can’t tell you didn’t like it!

## What Is Next?

Well, there are many more features that I can talk about it. But I don’t aim to create another documentation about it because I already did. Please visit the Axe API Documentation page. You may find many details about the project.

I am asking for feedback from everybody who has anything to say. Whenever I think about the project, it makes me so excited because of its potential. I hope you may have the same feelings.

Also, please keep in mind that the Axe API is not ready to use in production, and it is in the beta stage.

You can star the project on GitHub and get notifications about the news.
