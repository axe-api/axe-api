import {
  getScenarios,
  setEnvFile,
  getServeOptions,
  executeScenario,
} from "./src/Helpers.js";

const main = async () => {
  const database =
    process.argv && process.argv.length > 2 ? process.argv[2] : null;
  if (!database) {
    throw new Error(
      `You have to select a database. For example; node index.js sqlite`
    );
  }

  const serveOptions = await getServeOptions(database);
  const scenarios = await getScenarios();
  await setEnvFile(serveOptions);

  for (const scenario of scenarios) {
    await executeScenario(serveOptions, scenario);
  }

  process.exit(0);
};

main();
