import dotenv from "dotenv";
dotenv.config();

module.exports = async () => {
  const { default: configurations } = await import(
    "./scenarios/app/Config/Database.js"
  );

  configurations.migrations.directory = "./scenarios/migrations";
  return configurations;
};
