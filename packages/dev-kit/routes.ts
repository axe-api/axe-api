import { createRoutes } from "axe-api";
import posts from "./app/v1/resources/posts";
import comments from "./app/v1/resources/comments";

const routes = createRoutes("/api");

routes.group("v1", (group) => {
  group.root(posts).with(comments);
});

export default routes;
