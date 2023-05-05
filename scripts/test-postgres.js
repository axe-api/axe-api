const { execSync } = require('child_process');

console.log('Postgres Tests have been started.');

console.log('Setting up Postgres container images');
execSync('docker-compose -f "./tests/integrations/docker-compose.postgres.yml" down');
execSync('docker-compose -f "./tests/integrations/docker-compose.postgres.yml" up -d --build');

execSync('npm run build');

console.log('Waiting for 10 seconds');
execSync('sleep 10');

console.log('Starting the application and tests');
execSync('cd ./tests/integrations && npm run build && node index.js postgres');

console.log('Downing the database container');
execSync('cd ../../ && docker-compose -f "./tests/integrations/docker-compose.postgres.yml" down');
