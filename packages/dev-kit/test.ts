import { Schema } from "./resource";
import { defineResource, useInsertHandler } from "axe-api";

console.log("dev-kit");

const resource = defineResource(Schema.Users);
resource.primaryKey("id");

const insert = useInsertHandler(resource);
insert.fillable(["name", "email"]);

console.log(resource.config);
