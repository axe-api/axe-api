const path = require("path");

module.exports = async () => {
  return {
    rootDir: `tests`,
    bail: 1,
    testSequencer: path.resolve(__dirname, "testSequencer.js"),
    setupFilesAfterEnv: [path.resolve(__dirname, "setup-jest.js")],
  };
};
