import http, { IncomingMessage } from "http";
import { getCoreRouter, Route } from "./createRoutes";

export type ServerConfig = {
  routes: Route | null;
};

export const createServer = () => {
  const config: ServerConfig = {
    routes: null,
  };

  return {
    setRoutes(routes: Route) {
      config.routes = routes;
      return this;
    },

    listen(port: number) {
      const router = getCoreRouter();
      router.on("GET", "/", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "hello world" }));
      });

      const server = http.createServer((req, res) => {
        router.lookup(req as IncomingMessage, res);
      });

      server.listen(port, () => {
        console.log(`🚀 Server listening on: http://localhost:${port}`);
      });
    },
  };
};
