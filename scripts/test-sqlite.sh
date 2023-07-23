set -e

echo "SQLite Tests have been started."

npm run build

echo "Starting the application and tests"
cd ./tests/integrations && npm install && npm run build && node index.js sqlite
