import { UserSchema } from "./resource";
import { useResource, useInsertHandler } from "axe-api";

console.log("dev-kit");

const resource = useResource(UserSchema);

const insert = useInsertHandler(resource);
insert.fillable(["name", "email"]);

console.log(resource.config);
