import { required, email, min, max } from "robust-validator";
import { shouldBeAdmin, shouldBeLoggedIn } from "./middlewares";
import { defineResource, Schema, useInsertHandler } from "./resource";

const resource = defineResource(Schema.Users);

resource.middlewares(shouldBeLoggedIn, shouldBeAdmin);

const insert = useInsertHandler(resource);
insert.fillable(["id", "email", "name"]);
insert.validation({
  email: [required(), email()],
  name: [required(), min(1), max(50)],
});

export default resource;
