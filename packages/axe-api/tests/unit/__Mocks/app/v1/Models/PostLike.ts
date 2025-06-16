import { QueryFeature } from "../../../../../../src/Enums";
import Model from "../../../../../../src/Model";
import { allow } from "../../../../../../src/Services";

class PostLike extends Model {
  get limits() {
    return [allow(QueryFeature.All)];
  }
}

export default PostLike;
