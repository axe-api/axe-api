import { Schema } from "./resource";
import { useResource, useInsertHandler } from "axe-api";

console.log("dev-kit");

const resource = useResource(Schema.Users);
resource.primaryKey("id");

const insert = useInsertHandler(resource);
insert.fillable(["name", "email"]);

console.log(resource.config);
