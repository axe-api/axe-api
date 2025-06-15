set -e

echo "SQLite Tests have been started."

echo "Setting up Docker containers"
docker compose -f "./composes/docker-compose.sqlite.yml" down
docker compose -f "./composes/docker-compose.sqlite.yml" up -d --build

echo "Starting the application and tests"
npm install

export DB_CLIENT=sqlite

rm -rf ../axedb.sql
knex migrate:latest --knexfile knex/sqlite.config.js

echo "Waiting for 5 seconds"
sleep 5

npm run dev & SERVER_PID=$!

echo "Waiting for server to be ready..."
until curl -s http://localhost:3000/docs > /dev/null; do
  sleep 1
done

echo "Running tests..."
npm run test
