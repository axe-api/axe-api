# Tests

<p class="description">
In this section, we are going to explain how you can run axe-api tests.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>What kind of tests do we have?</li>
  <li>How to execute unit tests?</li>
  <li>How to execute integration tests?</li>
</ul>

## Getting started

`Axe API` has many tests both unit and integration. We are expecting you, as a developer, to contribute not only features or bugs but tests.

Besides, we believe that integration tests especially should be able to execute very easily.

In this tutorial, we are going to explain everything about tests.

## Unit Tests

You can execute all unit tests with the following command;

```bash
$ npm run test
```

We suggest that use the following command when you are developing something to not break anything important;

```bash
$ npm run test:dev
```

:::tip
In Axe API we use [Jest](https://jestjs.io/).
:::

## Integration Tests

Integration tests are more complicated than unit tests. Because we want to test a real Rest API on a specific database such as MySQL or PostgreSQL. It means that you should have the real database server on your local machine.

Thanks to Docker, it is very easy these days to have a database on your machine. Also, we created some scripts to execute all the tests with all migration support.

Just you need to have [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/) on your local machine.

After you have installed docker-compose on your machine, for example, you can execute the following command to perform MySQL 8 integration tests.

```bash
npm run test:mysql8
```

This command will execute a script that pulls MySQL 8, initialize it, initialize the testing API, and execute all integration tests.

:::tip
We suggest that you run integration tests, in the beginning, to see if everything is ok.
:::

Currently, we have the following integration tests;

- `npm run test:mysql57`
- `npm run test:mysql8`
- `npm run test:postgres`

## Next steps

In this section, we tried to cover how you can test your changes.

By this, you completed the Learn section of the Axe API Documentation. You can check the API Reference out to get more information about Axe API.
