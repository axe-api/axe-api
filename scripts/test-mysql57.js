const { execSync } = require('child_process');

console.log('MySQL-5.7 Tests have been started.');

console.log('Setting up MySQL container images');
execSync('docker-compose -f "./tests/integrations/docker-compose.mysql57.yml" down');
execSync('docker-compose -f "./tests/integrations/docker-compose.mysql57.yml" up -d --build');

execSync('npm run build');

console.log('Waiting for 15 seconds');
execSync('sleep 15');

console.log('Starting the application and tests');
execSync('cd ./tests/integrations && npm run build && node index.js mysql57');

console.log('Downing the database container');
execSync('cd ../../ && docker-compose -f "./tests/integrations/docker-compose.mysql57.yml" down');
