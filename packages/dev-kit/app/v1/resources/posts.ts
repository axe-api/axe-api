import { usePaginateHandler, useResource } from "axe-api";
import { PostSchema } from "../../schema";

const posts = useResource(PostSchema);

const paginate = usePaginateHandler(posts);

posts.handlers(paginate);

export default posts;
