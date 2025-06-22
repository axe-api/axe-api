import { UserSchema } from "./resource";
import { useResource, useStoreHandler, usePaginateHandler } from "axe-api";
import { render } from "prettyjson";

console.log("Axe API dev-kit");

const resource = useResource(UserSchema);

const store = useStoreHandler(resource);
store.fillable(["name", "email"]);

const paginate = usePaginateHandler(resource);
paginate.setDefaultPerPage(10);

resource.bind(store, paginate);

console.log(render(resource.getConfig()));
