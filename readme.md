<h1 align="center">
  <br>
  <a href="https://axe-api.com/">
    <img src="https://axe-api.com/axe.png" alt="Markdownify" width="200">
  </a>
  <br>
  Axe API
  <br>
  <a href="https://badge.fury.io/js/axe-api">
    <img src="https://badge.fury.io/js/axe-api.svg" alt="npm version" height="18">
  </a>
  <a href="https://github.com/axe-api/axe-api/actions/workflows/npm-publish.yml" target="_blank">
    <img src="https://github.com/axe-api/axe-api/actions/workflows/npm-publish.yml/badge.svg?branch=master">
  </a>
  <a href="https://sonarcloud.io/dashboard?id=axe-api_axe-api" target="_blank">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=axe-api_axe-api&metric=alert_status">
  </a>
  <a href="https://github.com/axe-api/axe-api/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/axe-api/axe-api.svg">
  </a>
  <a href="https://opensource.org/licenses/MIT" target="_blank">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg">
  </a>
</h1>

Next Generation Rest API Framework

> Axe API has great documentation. Please [check it out in here](https://axe-api.com/).

## What Is Axe API?

Axe API is a [Node.js](https://nodejs.org/) framework that helps you create a **Rest API** in a declarative way quickly. :axe:

It has been written with [TypeScript](https://www.typescriptlang.org/) and built on [Express](https://expressjs.com/) and [Knex.js](https://knexjs.org/).

## Motivation

You would understand easily what you are going to code when you look at a bunch of database tables and their relations with each other, more or less. Because, as a developer, you already know that _Rest API_ best practices.

Therefore I asked a simple question more than two years ago;

**_"Can we create a Rest API in a declarative way, and handle all endpoints automatically?"_**

As a result of our work, we have a framework called Axe API that provides a solution to analyze your API definitions and handle all of the endpoints.

Basically, you define your models which are your API definitions, and Axe API analyzes them and processes all of your endpoints instead of you.

## Showcase

Let's look at an example!

You have two database tables; `users` and `posts`. These tables are related to each other and we aim that create a **Rest API** for basic **CRUD** endpoints.

The only thing to do is creating models like the following example;

```ts
class User extends Model {
  get fillable(): string[] {
    return ["email", "name", "surname"];
  }

  posts(): IRelation {
    return this.hasMany("Post", "id", "user_id");
  }
}
```

```ts
class Post extends Model {
  get fillable(): string[] {
    return ["title", "description"];
  }

  user(): IRelation {
    return this.belongsTo("User", "user_id", "id");
  }
}
```

Tada! :tada:

Your API is ready to process all of the following endpoints after those model definitions are done.

- [GET] `api/users`
- [POST] `api/users`
- [GET] `api/users/:id`
- [PUT] `api/users/:id`
- [DELETE] `api/users/:id`
- [GET] `api/users/:userId/posts`
- [POST] `api/users/:userId/posts`
- [GET] `api/users/:userId/posts/:id`
- [PUT] `api/users/:userId/posts/:id`
- [DELETE] `api/users/:userId/posts/:id`

This is the main power of Axe API. Nevertheless, it is not limited only to this power. There are many more features are waiting to discover. :bulb:

## Installation

Using **Axe API** in an application is very easy. We've created a CLI tool for you; [axe-magic](https://github.com/axe-api/axe-magic).

You can create a new Axe API project by using [axe-magic](https://github.com/axe-api/axe-magic). But first, you can install it in your development environment. When you installed it, you can be able to access **axe-magic** command via CLI. You can use the following command to install **axe-magic** to your machine;

```bash
$ npm i -g axe-magic
$ axe-magic --version
1.0.0
```

After that, creating a new project is very easy. Just you can execute the following command;

```bash
$ axe-magic new my-api
```

This command will pull [axe-api-template](https://github.com/axe-api/axe-api-template) project to your current directory with a new name, **my-api**.

To install your project's depencies, you can execute the following commands in the root directory;

```bash
$ cd my-api
$ npm install
```

To serve this application, you can execute the following command;

```bash
$ npm run start:dev
```

After that, your first **Axe API** application will be running in `localhost:3000`.

You will see the following API response if you visit [localhost:3000](http://localhost:3000).

```json
{
  "name": "AXE API",
  "description": "The best API creation tool in the world.",
  "aim": "To kill them all!"
}
```

If you can see that response, it means that your project is running properly.

## Documentation

Axe API has great documentation. Please [check it out in here](https://axe-api.com/).

## License

[MIT License](LICENSE)
