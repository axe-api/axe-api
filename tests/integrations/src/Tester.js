import jest from "jest";

export const testRunner = async (path) => {
  return await jest.runCLI(
    {
      rootDir: `scenarios/${path}`,
    },
    ["."]
  );
};
