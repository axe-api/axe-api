echo "MySQL-5.7 Tests have been started."

echo "Setting up MySQL container images"
docker-compose -f "./tests/integrations/docker-compose.mysql57.yml" down
docker-compose -f "./tests/integrations/docker-compose.mysql57.yml" up -d --build

echo "Waiting for 15 seconds"
sleep 15

echo "Starting the application and tests"
cd ./tests/integrations && node index.js mysql57

echo "Downing the database container"
cd ../../
docker-compose -f "./tests/integrations/docker-compose.mysql57.yml" down