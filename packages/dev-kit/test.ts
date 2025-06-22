import { UserSchema } from "./resource";
import { useResource } from "axe-api";
import { render } from "prettyjson";
import { basePaginationHandler } from "./myDefaults";

const resource = useResource(UserSchema);
resource.primaryKey("id");

const paginate = basePaginationHandler(resource);
paginate.allowedFields(["id", "name", "email"]);

resource.handlers(paginate);

console.log(render(resource.getConfig()));
