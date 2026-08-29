// vitest.config.ts
import { defineConfig } from "vitest/config";
import {
  BaseSequencer,
  TestSequencerConstructor,
  TestSpecification,
} from "vitest/node";

const CustomSequencer: TestSequencerConstructor = class extends BaseSequencer {
  async sort(files: TestSpecification[]) {
    return files
      .toSorted((a, b) => a.moduleId.localeCompare(b.moduleId))
      .reverse();
  }
};

export default defineConfig({
  test: {
    globals: true, // If you use global functions like `describe`, `it`, etc.
    environment: "node", // For Node.js projects
    include: ["**/*.spec.{js,ts}"], // or your custom pattern
    setupFiles: ["./vitest-setup.ts"],
    sequence: {
      concurrent: false, // run test files one by one
      shuffle: false, // optional: keep file order predictable
      sequencer: CustomSequencer,
    },
    pool: "forks",
    fileParallelism: false,
    maxWorkers: 1,
    isolate: false,
  },
});
