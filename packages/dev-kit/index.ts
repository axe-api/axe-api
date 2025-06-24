import { createServer, showHint } from "axe-api";
import router from "./router";

showHint(__dirname);

const server = createServer();
server.setRouter(router);
server.listen(3000);
