import { QueryFeature } from "../../../../../../src/Enums";
import Model from "../../../../../../src/Model";
import { allow } from "../../../../../../src/Services";
import { IContext } from "../../../../../../src/Interfaces";

class Comment extends Model {
  get middlewares() {
    return [(context: IContext) => {}];
  }

  get transaction() {
    return false;
  }

  get limits() {
    return [allow(QueryFeature.All)];
  }

  author() {
    return this.hasOne("Author", "comment_id", "id");
  }
}

export default Comment;
