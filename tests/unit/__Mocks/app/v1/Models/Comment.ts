import { QueryFeature } from "../../../../../../src/Enums";
import Model from "../../../../../../src/Model";
import { allow } from "../../../../../../src/Services";
import { IRequestPack } from "../../../../../../src/Interfaces";

class Comment extends Model {
  get middlewares() {
    return [(context: IRequestPack) => {}];
  }

  get transaction(): null {
    return null;
  }

  get limits() {
    return [allow(QueryFeature.All)];
  }

  author() {
    return this.hasOne("Author", "comment_id", "id");
  }
}

export default Comment;
