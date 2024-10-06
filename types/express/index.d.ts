export {};

declare module "http" {
  interface IncomingMessage {
    body: any;
    tags: string[];
  }

  interface ServerResponse {
    isResponded?: boolean;
  }
}
