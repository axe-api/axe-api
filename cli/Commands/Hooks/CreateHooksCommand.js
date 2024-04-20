const fs = require("fs");
const path = require("path");
const { getPaths } = require("../../helpers");
require("colors");

const TEMPLATE = `/**
 * This is a hook file! You can add your business logic to here.
 *
 * @link https://axe-api.com/learn/hooks-and-events.html
 */

console.log("Add your hooks to this file: {NAME}");`;

module.exports = async function (hookArray) {
  const { hooks } = getPaths();

  for (const name of hookArray) {
    const directory = path.join(hooks, name);

    if (fs.existsSync(directory) === false) {
      fs.mkdirSync(directory);
    }

    const fileName = path.join(directory, "index.ts");
    const displayName = fileName.replace(process.cwd(), "");

    if (fs.existsSync(fileName)) {
      console.log(`The hook is already defined: ${displayName}`.red);
      continue;
    }

    const content = TEMPLATE.replace("{NAME}", name);
    fs.writeFileSync(fileName, content);

    console.log(`The hook is defined: ${displayName}`.green);
  }
};
