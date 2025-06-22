import { UserSchema } from "./resource";
import { useResource } from "axe-api";
import { render } from "prettyjson";
import { defaultPagination } from "./myDefaults";

const resource = useResource(UserSchema);
resource.primaryKey("id");

const paginate = defaultPagination(resource);
paginate.allowedFields(["id", "name", "email"]);

resource.bind(paginate);

console.log(render(resource.getConfig()));
