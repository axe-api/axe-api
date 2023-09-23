export {};

declare module "http" {
  interface IncomingMessage {
    body: any;
    tags: string[];
  }
}
