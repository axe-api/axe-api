echo "MySQL-8 Tests have been started."

echo "Setting up MySQL container images"
docker-compose -f "./tests/integrations/docker-compose.mysql8.yml" down
docker-compose -f "./tests/integrations/docker-compose.mysql8.yml" up -d --build

npm run build

echo "Waiting for 10 seconds"
sleep 10

echo "Starting the application and tests"
cd ./tests/integrations && node index.js mysql8

echo "Downing the database container"
cd ../../
docker-compose -f "./tests/integrations/docker-compose.mysql8.yml" down