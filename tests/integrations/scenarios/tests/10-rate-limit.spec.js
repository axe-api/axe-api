const DOMAIN = "http://localhost:3000/api";

describe("Axe API rate limitting feature", () => {
  test("should be able to see general rate limit", async () => {
    const response = await fetch(`${DOMAIN}/v1/users`);
    expect(response.headers.get("x-ratelimit-limit")).toBe("10000");
  });

  test("should be able to see rate limit responses in a specific model", async () => {
    const response = await fetch(`${DOMAIN}/v1/feeds`);
    expect(response.headers.get("x-ratelimit-limit")).toBe("2");
    expect(response.headers.get("x-ratelimit-remaining")).toBe("1");
  });
});
