/* eslint-disable no-undef */
const {
  setEnvFile,
  getServeOptions,
  executeScenario,
} = require('./src/Helpers.js');

const main = async () => {
  const database =
    process.argv && process.argv.length > 2 ? process.argv[2] : null;
  if (!database) {
    throw new Error(
      'You have to select a database. For example; node index.js sqlite'
    );
  }

  const serveOptions = await getServeOptions(database);
  await setEnvFile(serveOptions);
  await executeScenario(serveOptions);
  process.exit(0);
};

main();
