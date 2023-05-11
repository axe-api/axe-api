const { spawn } = require('child_process');
const path = require('path');

class Runner {
  constructor() {
    // eslint-disable-next-line no-undef
    const fullPath = path.join(__dirname, '..', 'build', 'serve.js');
    console.log('runner', fullPath);

    this.child = spawn('node', [fullPath]);
    this.child.stdout.on('data', (data) => {
      process.stdout.write(`${data}`);
    });

    this.child.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
  }

  kill() {
    this.child.kill('SIGINT');
  }
}

module.exports = Runner;
