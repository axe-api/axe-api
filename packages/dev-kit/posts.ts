import { defineResource, Schema, useInsertHandler } from "./resource";

const resource = defineResource(Schema.Posts);

// Add insert
const insert = useInsertHandler(resource);
insert.fillable(["id", "title"]);
insert.validation({ title: "required|min:1|max:255" });

export default resource;
