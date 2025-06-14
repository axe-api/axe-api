import { describe, expect, test } from "@jest/globals";
import { isBoolean } from "../../../src/Handlers/Helpers";

describe("Helpers", () => {
  [null, undefined, "", "xxx", "false", "0", "no", "off"].forEach((value) => {
    test(`.isBoolean(${value}) should be able to return FALSE`, async () => {
      expect(isBoolean(value)).toBe(false);
    });
  });

  ["true", "1", "on", "yes"].forEach((value) => {
    test(`.isBoolean(${value}) should be able to return TRUE`, async () => {
      expect(isBoolean(value)).toBe(true);
    });
  });
});
