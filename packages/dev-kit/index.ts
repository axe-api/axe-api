import dotenv from "dotenv";
import path from "path";
import { Server } from "axe-api";

console.log("Axe API dev-kit (1.0.1)");
dotenv.config();

const server = new Server();
server.start(path.join(process.cwd()));
