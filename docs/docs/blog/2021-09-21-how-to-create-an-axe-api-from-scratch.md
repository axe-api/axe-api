# How to create an Axe API from scratch?

## What is Axe API?

Axe API is the fastest way to create Rest API by defining only database models and relationships between them. It is built on Knex.js, and its awesome active records pattern. On the other hand, you have another familiar thing, Express.

Axe API provides you the ability to separate your common tasks to build an API from your business logic. Axe API expects model definitions to analyze your routing structure. After you created your models and their relations between them, Axe API can handle all well-known API requests. Creating an API with 5 tables takes almost 15 minutes.

Shortly, Axe API performs three basic functions;

- Analyzes your models and their relationships to create routes.
- Handles all HTTP requests.
- Separate your business logic from API best practices.

## Installation

Using Axe API in an application is very easy. We’ve created a CLI tool for you; axe-magic

You can use the following command to install axe-magic to your machine;

```bash
$ npm i -g axe-magic
$ axe-magic --version
1.0.0
```

After that, creating a new project is very easy. Just you can execute the following command;

```bash
$ axe-magic new my-api
```

## Install Dependencies

To install your project’s dependencies, you can execute the following commands in the root directory;

```bash
$ cd my-api
$ npm install
```

## Serving The App

To serve this application, you can execute the following command;

```bash
$ npm run start:dev
```

> start:dev command use nodemon. If you haven’t installed it yet, we suggest you install it first.

After that, your first Axe API application will be running in localhost:3000. You will see the following API response if you visit localhost:3000

```json
{
  "name": "AXE API",
  "description": "The best API creation tool in the world.",
  "aim": "To kill them all!"
}
```

If you can see that response, it means that your project is running properly.

## Learn More

If you want to deep dive to Axe API, you can use the following documents;
