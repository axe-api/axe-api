// testSequencer.js
const Sequencer = require("@jest/test-sequencer").default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    // Test structure information
    const copyTests = Array.from(tests);
    return copyTests.sort((testA: any, testB: any) =>
      testA.path > testB.path ? 1 : -1
    );
  }
}

module.exports = CustomSequencer;
