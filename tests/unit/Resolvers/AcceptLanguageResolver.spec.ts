import { describe, test, expect } from "vitest";
import { AcceptLanguageResolver } from "../../../src/Resolvers";

describe("AcceptLanguageResolver", () => {
  test(".toLanguageObject() should able to parse the language value correctly", async () => {
    let result = AcceptLanguageResolver.toLanguageObject("en");
    expect(result.title).toBe("en");
    expect(result.language).toBe("en");
    expect(result.region).toBe(null);

    result = AcceptLanguageResolver.toLanguageObject("en-GB");
    expect(result.title).toBe("en-GB");
    expect(result.language).toBe("en");
    expect(result.region).toBe("GB");
  });

  test(".resolve() should able to return the default language when the value is asterisk", async () => {
    expect(AcceptLanguageResolver.resolve("*", ["en"], "en").title).toBe("en");
    expect(AcceptLanguageResolver.resolve("*", ["en"], "en-GB").title).toBe(
      "en-GB",
    );
  });

  test(".resolve() should able to return the matched language", async () => {
    let result = AcceptLanguageResolver.resolve(
      "fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5",
      ["en"],
      "en",
    );
    expect(result.title).toBe("en");

    result = AcceptLanguageResolver.resolve(
      "fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5",
      ["fr", "en"],
      "en",
    );
    expect(result.title).toBe("fr");

    result = AcceptLanguageResolver.resolve(
      "fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5",
      ["fr", "fr-CH", "en"],
      "en",
    );
    expect(result.title).toBe("fr-CH");

    result = AcceptLanguageResolver.resolve(
      "fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5, fr-CH",
      ["fr", "fr-CH", "en"],
      "en",
    );
    expect(result.title).toBe("fr-CH");

    result = AcceptLanguageResolver.resolve(
      "fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5, fr-CH",
      ["tr"],
      "en",
    );
    expect(result.title).toBe("en");

    result = AcceptLanguageResolver.resolve("en-GB;q=0.9", ["en"], "tr");
    expect(result.title).toBe("en-GB");

    result = AcceptLanguageResolver.resolve(
      "tr-TR,en;q=0.8",
      ["en", "tr"],
      "en-GB",
    );
    expect(result.title).toBe("tr");
  });
});
