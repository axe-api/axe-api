# Axe API v1.4 is out!

`v1.4` comes with one feature and a security upgrades.

Let's discover it more!

## Axe CLI

Axe API had a separate tool called `axe-magic` to provide some CLI functionalities such as creating a new Axe API project. Axe API started to provide this CLI tool as a part of the framework library with the new version.

You can install the `axe-api` framework as a CLI tool if you wish.

```bash
$ npm install -g axe-api
```

You can start to use the `axe` CLI command after the installation.

```bash
$ axe

Usage: axe-magic [options] [command]

AXE API CLI tool

Options:
  -V, --version             output the version number
  -h, --help                display help for command

Commands:
  new <project-name>        Create a new Axe API project.
  model:create <models...>  Create model files
  hooks:create <models...>  Create hooks files for models
  help [command]            display help for command
```
