/* eslint-disable no-undef */
const knex = require("knex");
const path = require("path");
const fs = require("fs");
const Runner = require("./Runner.js");
const { testRunner } = require("./Tester.js");

const waitForIt = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const getServeOptions = async (database) => {
  const content = fs.readFileSync("./serve-options.json", "utf-8");
  const options = JSON.parse(content);
  return options[database];
};

const executeScenario = async (serveOptions) => {
  const connection = knex({
    client: serveOptions.DB_CLIENT,
    connection: {
      host: serveOptions.DB_HOST,
      user: serveOptions.DB_USER,
      password: serveOptions.DB_PASSWORD,
      database: serveOptions.DB_DATABASE,
      port: serveOptions.DB_PORT,
    },
    searchPath: [process.env.DB_USER, "public"],
    migrations: {
      directory: `./scenarios/migrations`,
    },
  });
  process.stdout.write("Database is updating...");
  await connection.migrate.latest();
  process.stdout.write("SUCCESS!\n");

  // App
  const app = new Runner("");
  await waitForIt(5000);
  const response = await testRunner();
  if (!response.results.success) {
    process.exit(1);
  }

  process.stdout.write("Database is downgrading...");
  await connection.migrate.down();
  process.stdout.write("SUCCESS!\n");

  app.kill();
};

const setEnvFile = async (serveOption) => {
  console.log(`SERVER: ${serveOption._title}`);
  let content = "";
  for (const key of Object.keys(serveOption)) {
    if (key === "_title") {
      continue;
    }
    content += `${key}=${serveOption[key]}\n`;
  }
  const buildPath = path.join(__dirname, "..", "build", ".env");
  await fs.writeFileSync(buildPath, content);

  const testPath = path.join(__dirname, "..", ".env");
  await fs.writeFileSync(testPath, content);
  console.log(".env file has been created on: ", testPath, buildPath);
};

module.exports = {
  waitForIt,
  getServeOptions,
  executeScenario,
  setEnvFile,
};
