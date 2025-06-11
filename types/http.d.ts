// src/types/http.d.ts
import "http";

declare module "http" {
  interface ServerResponse {
    isResponded?: boolean;
  }

  interface IncomingMessage {
    tags: string[];
    body: Record<string, any>;
  }
}
