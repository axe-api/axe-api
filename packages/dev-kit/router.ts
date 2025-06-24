import { createRouter } from "axe-api";
import users from "./app/v1/resources/users";
import posts from "./app/v1/resources/posts";

const router = createRouter("/api");

const shouldBeAdmin = () => {};

router.group("v1", (group) => {
  group.use(shouldBeAdmin);
  group.mount(users);
  group.mount(posts);
});

export default router;
