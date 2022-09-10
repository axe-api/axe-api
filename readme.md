<h1 align="center">
  <br>
  <a href="https://axe-api.github.io/">
    <img src="https://axe-api.github.io/logo.png" alt="Markdownify" width="200">
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

The fastest way to create Rest API, by defining database models and relations.

> Axe API has great documentation. Please [check it out in here](https://axe-api.github.io/).

## What Is Axe API?

**Axe API** is the _fastest_ way to create **Rest API** by defining only database models and relationships between them. It is built on [Knex.js](http://knexjs.org), and its awesome active records pattern. On the other hand, you have another familiar thing, [Express](https://expressjs.com/).

You are going to be able to develop an API **10 times faster** with **Axe API**!

## How It Works?

[Express](https://expressjs.com/) and [Knex.js](http://knexjs.org) are great tools to create [Node.js](https://nodejs.org) based applications. But usually, we code too much the same things to design an API. We aim to reduce code duplication and give you speed by using Axe API.

Axe API provides you the ability to separate your common tasks to build an API from your business logic. **Axe API** expects model definitions to analyze your routing structure. After you created your models and their relations between them, Axe API can handle all _well-known_ API requests. Creating an API with 5 tables takes almost 15 minutes.

Shortly, **Axe API** performs three basic functions;

- **Analyzes** your models and their relationships to create routes.
- **Handles** all HTTP requests.
- **Separate** your business logic from API best practices.

Let's assume that you have a model like this;

```js
import { Model } from "axe-api";

class User extends Model {}
```

With this model, you will have all of the basic API routes for **User** resources. **Axe API** will create **CRUD** routes for you in the _booting_ process and these routes would be completely ready to be handled and processed by Axe API. The following routes will be handled automatically;

- `POST api/users`
- `GET api/users`
- `GET api/users/:id`
- `PUT api/users/:id`
- `DELETE api/users/:id`

This is the magic of **Axe API**!

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

> `start:dev` command use [nodemon](https://www.npmjs.com/package/nodemon). If you haven't installed it yet, we suggest you install it first.

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

Axe API has great documentation. Please [check it out in here](https://axe-api.github.io/).

## How To Run Integration Tests

> You have to have **Docker** and **Docker Compose** on your local development environment to run integration tests.

Execute the following commands to prepare the integration app

```sh
cd tests/integrations && npm install && npm ci && npm run build --if-present
```

Execute the following commands to prepare the database;

```sh
docker-compose -f "./tests/integrations/docker-compose.mysql8.yml" up -d --build
```

> To down the database, you can use the following command; `docker-compose -f "./tests/integrations/docker-compose.mysql8.yml" up -d --build`

You can execute the following command to execute tests;

```sh
npm run test:integration:mysql8
```

## License

[MIT License](LICENSE)

## Prerelease

- Update package.json, set version to a prerelease version, e.g. 2.0.0-rc1, 3.1.5-rc4, ...
- Run npm pack to create package
- Run npm publish <package>.tgz --tag next to publish the package under the next tag
- Run npm install --save package@next to install prerelease package
