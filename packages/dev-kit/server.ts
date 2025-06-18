import { render } from "prettyjson";
import { RelationTree } from "./resource";
import { type resources } from "./resources";

export default (models: typeof resources, relations: RelationTree) => {
  // console.log(render(models));

  return {
    listen(port: number) {
      console.log(`The API is running on ${port}`);
    },
  };
};
