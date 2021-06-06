import jest from "jest";

export const testRunner = async (path) => {
  await jest.runCLI(
    {
      rootDir: `scenarios/${path}`,
    },
    ["."]
  );
};
