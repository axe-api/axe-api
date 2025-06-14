# Integration Tests

Here, we created a basic application that uses Axe API's latest version as a dependency. To develop or debug integration tests, you should use the following command;

```bash
$ npm install
$ docker compose -f "docker-compose.mysql8.yml" up -d --build
$ knex --esm migrate:latest
$ npm run start:dev
```

After these command, the dummy API would be ready to run integration tests. You can use the following command to execute tests;

```bash
$ npm run test:dev
```

## Database Type

You can run different database servers by using Docker.

## Migrations

You can use the following commands to up or down migrations;

```bash
$ knex --esm migrate:rollback
$ knex --esm migrate:latest
```
