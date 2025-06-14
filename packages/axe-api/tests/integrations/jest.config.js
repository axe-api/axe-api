module.exports = async () => {
  return {
    rootDir: `build/scenarios`,
    testSequencer: "./../testSequencer.cjs",
    setupFilesAfterEnv: ["<rootDir>/../setup-jest.js"],
  };
};
