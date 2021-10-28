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

> This project is under development and not ready for production.

Fastest way to create simple Rest API by defining database models and relations.

## Key Features

- Automatic route creating
- Automatic route handling
- Form validation support
- Middlewares
- Strong query features
- Recursive resources
- The extendable business logic structure
- Multiple database support (Postgres, MSSQL, MySQL, MariaDB, SQLite3, Oracle, and Amazon Redshift)
- Well documented

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
