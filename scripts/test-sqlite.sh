set -e

echo "SQLite Tests have been started."

echo "Setting up Docker containers"
docker-compose -f "./tests/integrations/docker-compose.sqlite.yml" down
docker-compose -f "./tests/integrations/docker-compose.sqlite.yml" up -d --build

npm run build

echo "Waiting for 3 seconds"
sleep 3

echo "Starting the application and tests"
cd ./tests/integrations && npm install && npm run build && node index.js sqlite

echo "Downing the database container"
cd ../../
docker-compose -f "./tests/integrations/docker-compose.sqlite.yml" down