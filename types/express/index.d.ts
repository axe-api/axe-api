export {};

declare module "http" {
  interface IncomingMessage {
    body: any; // Change 'any' to the actual type you expect for the body
  }
}
