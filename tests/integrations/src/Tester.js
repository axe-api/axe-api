import jest from "jest";

export const testRunner = async (path) => {
  return await jest.runCLI(
    {
      rootDir: `scenarios/${path}`,
      runInBand: true,
      bail: 1,
      testSequencer: "./../testSequencer.cjs",
    },
    ["."]
  );
};
