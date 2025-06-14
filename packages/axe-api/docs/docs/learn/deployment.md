# Deployment

<p class="description">
To deploy an Axe API project, the process is just as straightforward as deploying any other Node.js application. In this section, we will talk about the deployment an Axe API project.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>What is deployment?</li>
  <li>How to deploy an Axe API project?</li>
  <li>How to execute migrations?</li>
  <li>How to dockerize an Axe API project?</li>
  <li>How to use docker-compose for an Axe API project?</li>
</ul>

## Getting started

Deployment is the process of making the API available for use on a server or hosting environment. It involves configuration, installing dependencies, and transferring the API code and associated files to the server.

The deployment process may involve steps like environment configuration, code compilation or interpretation, database migration, and setting up security measures.

Once deployed, the API becomes accessible to clients who can send requests and receive responses. Deployment ensures the API is ready for production use, reliable, and scalable to handle user traffic efficiently.

In this section, we will provide all information you need.

## Compiling the app

Since the Axe API uses **TypeScript** as the language, you need to compile your application to plain **JavaScript** in order to run it.

You can compile your application by using the following command;

```bash
$ npm run build
```

After this command, you will have a folder called `build`, and the `build` folder would have all of your compiled application codes, migration files, and other necessary parts of the application.

:::warning
Remember that in the `build` folder you should define your environment variables in the `.env` file. Since this is your production build, `npm run build` command does not include the `.env` file. You might add `.env` file automatically to the build folder by editing the `scripts/postbuild.sh` file if you want.
:::

## Execute the build

Your compiled codes are basic **Node.js** codes. So that, in the `build` folder, you can execute the application with the following command;

```bash
$ node index.js

[18:00:00] INFO: Axe API listens requests on http://localhost:3000
```

Tada! :tada:

## Database migrations

**Axe API** adds your migrations files to your `build` folder. Only thing you should do is executing the migrate command like the following one;

```bash
$ knex --esm migrate:latest

Batch 1 run: 2 migrations
```

:::warning
Remember that in your machine you must have the `knex` cli. You can install it by using the following code:

`npm i -g knex`
:::

:::tip
You can find more command example on the [Migration CLI Documentation](https://knexjs.org/guide/migrations.html#migration-cli)
:::

## Dockerize

**Axe API** adds `Dockerfile` to your build folder by default. A standard **Axe API** Dockerfile looks like the following one;

```docker
FROM --platform=linux/amd64 node:18
# Create app directory
WORKDIR /home
# Install app dependencies
COPY package*.json ./
RUN npm install
# Building for a production
RUN npm ci --only=production
# To migrate database changes we need `knex` cli
RUN npm i -g knex
# Bundle app source
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

:::tip
You can change the `Dockerfile` by your requirements.
:::

Once you build your application, you can execute the following command in the `build` directory to build a docker image for your application;

```bash
$ cd build
$ docker build -t my-api-image .
```

Once your docker image is ready, you can execute it with the following command;

```bash
$ docker run -p 3000:3000 my-api-image
```

:::warning
Please keep in your mind that you should provide all environment variables in `.env` files or via docker environment parameters.
:::

## Docker Compose

Using a `docker-compose.yml` file could be very helpful in your project. You may find a simple example of a `docker-compose.yml` file in the following one. You are free to edit the example by your requirements.

```yaml
version: "3"

services:
  migration:
    image: my-api-image
    working_dir: /home
    command: knex --esm migrate:latest
    environment:
      DB_HOST: db_host
      DB_USER: db_user
      DB_PASSWORD: db_password
      DB_DATABASE: your_db_schema

  app:
    image: my-api-image
    command: node index.js
    restart: always
    depends_on:
      - migration
    ports:
      - 3000:3000
    environment:
      DB_HOST: db_host
      DB_USER: db_user
      DB_PASSWORD: db_password
      DB_DATABASE: your_db_schema
```

:::tip
You can use `host.docker.internal` as `DB_HOST` value to access the dabase which on located in your machine. You can find more details in the Docker documentation.
:::

## Dive deeper

We tried to show some of the basic deployment methods in here. Nevertheless we know that there are many different scenario which you can use. We encrouge Axe API developers to write blog posts abou how to deploy your application in different environments instead of adding many pages here.

No matter in which platform or environment you deploy your application, the following facts would be same;

- Your application is a _TypeScript_ application. It should be compiled to plain _JavaScript_.
- You need a supported _Node.js_ version in the machine which you will deploy.
- You need to execute the migration files via `knex` cli.
- You must execute the compiled _JavaScript_ file with _Node.js_.

Other than tehese are just implementation details.

## Next steps

In this section, we tried to cover how you can deploy your API.

In the next chapter, you can learn how you can contribute to Axe API.
