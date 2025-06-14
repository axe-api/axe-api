const { Command } = require("commander");
const program = new Command();
const newCommand = require("./Commands/NewCommand");
const createModelCommand = require("./Commands/Models/CreateModelCommand");
const createHooksCommand = require("./Commands/Hooks/CreateHooksCommand");

program.name("axe-magic").description("AXE API CLI tool").version("3.0.0");

program
  .command("new")
  .description("Create a new Axe API project.")
  .argument("<project-name>", "The name of the project")
  .action(newCommand);

program
  .command("model:create")
  .description("Create model files")
  .argument("<models...>", "Model names")
  .action(createModelCommand);

program
  .command("hooks:create")
  .description("Create hooks files for models")
  .argument("<models...>", "Model names")
  .action(createHooksCommand);

module.exports = {
  cli: () => program.parse(),
};
