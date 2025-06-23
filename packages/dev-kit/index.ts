import { createServer } from "axe-api";
import router from "./router";

const server = createServer();
server.setRouter(router);
server.listen(3000);
