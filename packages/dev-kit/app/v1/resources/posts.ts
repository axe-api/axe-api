import { usePaginateHandler, useResource } from "axe-api";
import { PostSchema } from "../../schema";

const users = useResource(PostSchema);

const paginate = usePaginateHandler(users);

users.handlers(paginate);

export default users;
