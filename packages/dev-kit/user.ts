import { defineResource, Schema, useInsertHandler } from "./resource";

const resource = defineResource(Schema.Users);

resource.insert.fillable(["id", "email", "name"]);

const insert = useInsertHandler(resource);
insert.fillable(["id", "email", "name"]);

insert.validation({
  email: "required|email",
  name: "required",
});

export default resource;
