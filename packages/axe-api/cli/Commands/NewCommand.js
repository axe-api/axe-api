const shell = require("shelljs");
const rimraf = require("rimraf");
const fs = require("fs");
require("colors");

module.exports = async function (name) {
  let errors = null;

  console.log(`Directory name would be: ${name}`.green);

  console.log("Pulling example Axe API project...".yellow);
  await shell.exec(
    `git clone https://github.com/axe-api/axe-api-template.git ${name}`,
  );

  errors = shell.error();
  if (errors !== null) {
    console.log("Some errors have occured!".red);
    shell.exit(0);
  }

  console.log("Creating .env file");

  await fs.renameSync(`${name}/.env.example`, `${name}/.env`);
  await rimraf.sync(`${name}/.git`);
  console.log(`The project has been created!`.green);
  console.log(`
  Usage:

    $ cd ${name}
    $ npm install & npm run start:dev
  `);
};
