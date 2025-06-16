import { describe, it, expect, vi } from "vitest";
import DocsHandler from "./DocsHandler";

describe("DocsHandler", () => {
  it("should set content-type header and return HTML content", async () => {
    const mockReq = {}; // not used
    const mockRes = {
      header: vi.fn(),
      send: vi.fn(),
    };

    await DocsHandler(mockReq, mockRes);

    expect(mockRes.header).toHaveBeenCalledWith("Content-Type", "text/html");
    expect(mockRes.send).toHaveBeenCalled();
    const sentHtml = mockRes.send.mock.calls[0][0];

    expect(sentHtml).toContain("<!DOCTYPE html>");
    expect(sentHtml).toContain("<title>SwaggerUI</title>");
    expect(sentHtml).toContain('<div id="swagger-ui"></div>');
  });
});
