import { ExtractResouceModel, UResource, SchemaDefinition } from "./xTypes";

export const uResource = <TSchema extends SchemaDefinition>(
  schema: TSchema,
) => {
  type Model = ExtractResouceModel<TSchema>;

  console.log("useR", schema);

  return {
    primaryKey(id: keyof Model) {
      console.log("primary key", id);
    },
  } as UResource<Model>;
};
