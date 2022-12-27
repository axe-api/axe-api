# Users should not be able to re-install the dev-kit in case of they have
# special configuration or changes. That's why we should not let the developer
# delete old configurations by re-installing.
if [ -d "./dev-kit" ]; then
  echo "'dev-kit' already installed.\n"
  exit
fi

if [ -d "./dev-kit.sh" ]; then
  echo "'dev-kit' already installed.\n"
  exit
fi

# Cloning the latest version of 'dev-kit'
git clone https://github.com/axe-api/dev-kit.git temp-kit

# Moving files to the correct location
mv temp-kit/dev-kit.ts ./dev-kit.ts
mv temp-kit/.env ./.env
mv temp-kit/dev-kit ./dev-kit

## Cleaning the temp-kit folder
rm -rf temp-kit

## Installing the SQLite migration for the first usage.
cd dev-kit
knex --esm migrate:latest

## Everything is done
echo "\ndev-kit has been installed.\n"