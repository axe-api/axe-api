set -e

echo "MariaDB Tests have been started."

echo "Setting up MariaDB container images"
docker compose -f "./tests/integrations/docker-compose.mariadb.yml" down
docker compose -f "./tests/integrations/docker-compose.mariadb.yml" up -d --build

npm run build

echo "Waiting for 10 seconds"
sleep 10

echo "Starting the application and tests"
cd ./tests/integrations && npm install && npm run build && node index.js mariadb

echo "Downing the database container"
cd ../../
docker compose -f "./tests/integrations/docker-compose.mariadb.yml" down