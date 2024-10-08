set -e

echo "Postgres-13 Tests have been started."

echo "Setting up Postgres-13 container images"
docker compose -f "./tests/integrations/docker-compose.postgres13.yml" down
docker compose -f "./tests/integrations/docker-compose.postgres13.yml" up -d --build

npm run build

echo "Waiting for 10 seconds"
sleep 10

echo "Starting the application and tests"
cd ./tests/integrations && npm install && npm run build && node index.js postgres13

echo "Downing the database container"
cd ../../
docker compose -f "./tests/integrations/docker-compose.postgres13.yml" down