import server from "./server";
import { models } from "./models";
import { relations } from "./relations";
import { ModelList } from "./resource";

server(models as ModelList, relations).listen(3000);

// const resource = defineResource(Schema.Users);
// resource.primaryKey("id");

// const shouldBeLoggedIn = () => {};
// const shouldBeAdmin = () => {};

// resource.insert.hooks.onBefore([shouldBeLoggedIn, shouldBeAdmin]);
// resource.insert.fillable(["name", "email"]);
// resource.insert.validation({ email: "required|mail", name: "required" });

// resource.update.fillable(["name"]);
// resource.update.validation({ name: "required" });

// const insert = useInsertHandler(resource);
// insert.fillable(["id", "email", "name"]);

// console.log(render(resource.config));
