import { UserSchema } from "./resource";
import { useResource } from "axe-api";
import { render } from "prettyjson";
import { basePaginationHandler } from "./myDefaults";

const users = useResource(UserSchema);

const paginate = basePaginationHandler(users);
paginate.allowedFields(["id", "name", "email"]);

users.handlers(paginate);

console.log(render(users.getConfig()));
