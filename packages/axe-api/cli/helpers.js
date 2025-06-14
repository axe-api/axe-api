const fs = require("fs");
const path = require("path");

const getPaths = () => {
  let root = path.join(process.cwd());

  if (fs.existsSync(path.join(root, "dev-kit"))) {
    root = path.join(root, "dev-kit");
  }

  const app = path.join(root, "app");
  const migrations = path.join(root, "migrations");

  const versions = fs.readdirSync(app).filter((item) => item !== "config.ts");
  const lastVersion = versions.at(-1);

  const version = path.join(app, lastVersion);

  const events = path.join(version, "Events");
  const handlers = path.join(version, "Handlers");
  const hooks = path.join(version, "Hooks");
  const middlewares = path.join(version, "Middlewars");
  const models = path.join(version, "Models");
  const serialization = path.join(version, "Serialization");

  return {
    app,
    migrations,
    lastVersion,
    version,
    events,
    handlers,
    hooks,
    middlewares,
    models,
    serialization,
  };
};

module.exports = {
  getPaths,
};
