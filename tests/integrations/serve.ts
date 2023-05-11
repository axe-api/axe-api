import path from 'path';
import dotenv from 'dotenv';
import { Server } from 'axe-api';

dotenv.config();
const appFolder = path.join(__dirname, 'scenarios');
const server = new Server();
server.start(appFolder);
