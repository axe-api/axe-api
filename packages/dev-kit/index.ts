import { createServer, showHint } from "axe-api";
import routes from "./routes";

showHint(__dirname);

const server = createServer();
server.setRoutes(routes);
server.listen(3000);
