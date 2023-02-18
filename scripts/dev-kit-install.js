const fs = require("fs");
const { exec, execSync } = require("node:child_process");
// Users should not be able to re-install the dev-kit in case of they have
// special configuration or changes. That's why we should not let the developer
// delete old configurations by re-installing.
if (fs.existsSync("./dev-kit")) {
  console.log("'dev-kit' already installed.\n");
  process.exit();
}

if (fs.existsSync("./dev-kit.sh")) {
  console.log("'dev-kit' already installed.\n");
  process.exit();
}

// Cloning the latest version of 'dev-kit'
execSync(
  "git clone https://github.com/axe-api/dev-kit.git temp-kit",
  (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      process.exit();
    }
  }
);

//Moving files to the correct location
fs.rename("temp-kit/dev-kit.ts", "./dev-kit.ts", function (err) {
  if (err) throw err;
});
fs.rename("temp-kit/.env", "./.env", function (err) {
  if (err) throw err;
});
fs.rename("temp-kit/dev-kit", "./dev-kit", function (err) {
  if (err) throw err;
});
// Cleaning the temp-kit folder
fs.rmSync("temp-kit", { recursive: true, force: true });

// Installing the SQLite migration for the first usage.
console.log("Installing the SQLite migration for the first usage.\n");

execSync(
  "knex --esm migrate:latest --knexfile ./dev-kit/knexfile.js",
  (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      process.exit();
    }
  }
);

// Everything is done
console.log("dev-kit has been installed.\n");
