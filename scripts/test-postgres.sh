set -e

echo "Postgres Tests have been started."

echo "Setting up MySQL container images"
docker-compose -f "./tests/integrations/docker-compose.postgres.yml" down
docker-compose -f "./tests/integrations/docker-compose.postgres.yml" up -d --build

npm run build

echo "Waiting for 10 seconds"
sleep 10

echo "Starting the application and tests"
cd ./tests/integrations && npm install && npm run build && node index.js postgres

echo "Downing the database container"
cd ../../
docker-compose -f "./tests/integrations/docker-compose.postgres.yml" down