set -e

echo "SQLite Tests have been started."

echo "Setting up Docker containers"
docker compose -f "./composes/docker-compose.sqlite.yml" down
docker compose -f "./composes/docker-compose.sqlite.yml" up -d --build

echo "Waiting for 5 seconds"
sleep 5

echo "Starting the application and tests"
pwd
npm install

rm -rf ../axedb.sql
knex migrate:latest --knexfile knex/sqlite.config.js

npm run dev:sqlite

# npm run dev:sqlite&
# SERVER_PID=$!

# echo "Waiting for server to be ready..."
# until curl -s http://localhost:3000/docs > /dev/null; do
#   sleep 1
# done

# echo "Running tests..."
# npm run test --runInBand --bail=1

echo "Downing the database container"
cd ../../
docker compose -f "./composes/docker-compose.sqlite.yml" down
