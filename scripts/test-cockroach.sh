set -e

echo "Cockroach DB tests have been started."

echo "Setting up Cockroach container image"
docker compose -f "./tests/integrations/docker-compose.cockroach.yml" down
docker compose -f "./tests/integrations/docker-compose.cockroach.yml" up -d --build

npm run build

echo "Waiting for 10 seconds"
sleep 10

echo "Starting the application and tests"
cd ./tests/integrations && npm install && npm run build && node index.js cockroach

echo "Downing the database container"
cd ../../
docker compose -f "./tests/integrations/docker-compose.cockroach.yml" down