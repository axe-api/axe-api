const fs = require("fs");
const path = require("path");
const { getPaths } = require("../../helpers");
require("colors");

const TEMPLATE = `import { Model } from "axe-api";

class {NAME} extends Model {

}

export default {NAME};
`;

module.exports = async function (modelArray) {
  const { models, lastVersion } = getPaths();

  for (const name of modelArray) {
    const content = TEMPLATE.replaceAll(`{NAME}`, name);
    const fileName = path.join(models, `${name}.ts`);

    if (fs.existsSync(fileName)) {
      console.log(
        `The model is already defined: app/${lastVersion}/${name}.ts`.red,
      );
      continue;
    }

    fs.writeFileSync(fileName, content);

    console.log(`The model is defined: app/${lastVersion}/${name}.ts`.green);
  }
};
