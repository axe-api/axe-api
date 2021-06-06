import request from "supertest";

describe("Axe API", () => {
  it("should be able to accept requests", async () => {
    await request("localhost:3000")
      .get("/")
      .expect("Content-Type", /json/)
      .expect(201, {
        name: "AXE API",
        description: "The best API creation tool in the world.",
        aim: "To kill them all!",
      });
  });
});
