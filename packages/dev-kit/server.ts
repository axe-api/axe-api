import { render } from "prettyjson";
import { ModelList, RelationTree } from "./resource";

export default (models: ModelList, relations: RelationTree) => {
  console.log(render(models));

  return {
    listen(port: number) {
      console.log(`The API is running on ${port}`);
    },
  };
};
