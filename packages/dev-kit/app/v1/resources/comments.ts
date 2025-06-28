import { usePaginateHandler, useResource } from "axe-api";
import { CommentsSchema } from "../../schema";

const comments = useResource(CommentsSchema);

const paginate = usePaginateHandler(comments);

comments.handlers(paginate);

export default comments;
