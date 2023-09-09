import path from "path";
import { Server } from "axe-api";

const appFolder = path.join(__dirname, "scenarios");
const server = new Server();
server.start(appFolder);
