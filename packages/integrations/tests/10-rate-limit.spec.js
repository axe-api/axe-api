import { describe, test, expect, beforeAll, afterAll } from "vitest";

const DOMAIN = "http://localhost:3000/api";

describe("Axe API rate limitting feature", () => {
  test("should be able to see general rate limit", async () => {
    const response = await fetch(`${DOMAIN}/v1/users`);
    expect(response.headers.get("x-ratelimit-limit")).toBe("999");
  });

  test("should be able to see rate limit responses in a specific model", async () => {
    const response = await fetch(`${DOMAIN}/v1/feeds`);
    expect(response.headers.get("x-ratelimit-limit")).toBe("2");
    expect(response.headers.get("x-ratelimit-remaining")).toBe("1");
  });

  test("should be able to create custom rate limitter", async () => {
    let response = await fetch(`${DOMAIN}/v1/custom-rate-limit`);
    expect(response.headers.get("x-custom-limitter-limit")).toBe("1");
    expect(response.headers.get("x-custom-limitter-remaining")).toBe("0");

    response = await fetch(`${DOMAIN}/v1/custom-rate-limit`);
    expect(response.status).toBe(429);

    const data = await response.json();
    expect(data.error).toBe("Rate limit exceeded.");
  });
});
