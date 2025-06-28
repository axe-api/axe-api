import { createRouter } from "axe-api";
import posts from "./app/v1/resources/posts";
import comments from "./app/v1/resources/comments";

const router = createRouter("/api");

router.group("v1", (group) => {
  group.group("sub", (subgroup) => {
    subgroup.root(posts).with(comments);
  });
});

// console.log(JSON.stringify(router, null, 2));

export default router;
