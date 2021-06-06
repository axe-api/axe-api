import path from "path";
import { Server } from "axe-api";

const appFolder = path.join(
  path.resolve(),
  "scenarios",
  process.argv[2],
  "app"
);
const server = new Server(appFolder);
server.listen();
