import { usePaginateHandler, useResource } from "axe-api";
import { UserSchema } from "../../schema";

const users = useResource(UserSchema);

const paginate = usePaginateHandler(users);
paginate.allowedFields(["id", "name", "email"]);

users.handlers(paginate);

export default users;
