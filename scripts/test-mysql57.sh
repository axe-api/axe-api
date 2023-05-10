set -e

echo "MySQL-5.7 Tests have been started."

echo "Setting up MySQL container images"
docker-compose -f "./tests/integrations/docker-compose.mysql57.yml" down
docker-compose -f "./tests/integrations/docker-compose.mysql57.yml" up -d --build

npm run build

echo "Waiting for 15 seconds"
sleep 15

echo "Starting the application and tests"
cd ./tests/integrations && npm run build && node index.js mysql57

echo "Downing the database container"
cd ../../
docker-compose -f "./tests/integrations/docker-compose.mysql57.yml" down