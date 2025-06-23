import { Router } from "./createRouter";

export type ServerConfig = {
  router: Router | null;
};

export const createServer = () => {
  const config: ServerConfig = {
    router: null,
  };

  return {
    setRouter(router: Router) {
      config.router = router;
      return this;
    },

    listen(port: number) {
      console.log(`Example app listening on port ${port}`);
    },
  };
};
