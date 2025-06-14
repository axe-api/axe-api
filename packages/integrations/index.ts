import dotenv from "dotenv";
import path from "path";
import { Server } from "axe-api";
import { setEnvSettings } from "./envSettings";

dotenv.config();

setEnvSettings();

const server = new Server();
server.start(path.join(process.cwd()));
