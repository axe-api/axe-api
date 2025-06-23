import { createRouter } from "axe-api";
import users from "./app/v1/resources/users";
import posts from "./app/v1/resources/posts";

const router = createRouter("/api");

router.version("v1", () => {
  return [users, posts];
});

export default router;
