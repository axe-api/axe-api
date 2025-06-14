const jest = require("jest");
const path = require("path");

const testRunner = async (fullpath = "") => {
  return await jest.runCLI(
    {
      rootDir: path.join("scenarios", fullpath),
      runInBand: true,
      bail: 1,
      testSequencer: path.join("..", "testSequencer.cjs"),
    },
    ["."],
  );
};

module.exports = {
  testRunner,
};
