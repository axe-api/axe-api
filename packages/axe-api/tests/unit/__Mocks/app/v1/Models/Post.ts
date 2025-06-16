import {
  HandlerTypes,
  HttpMethods,
  QueryFeature,
} from "../../../../../../src/Enums";
import { IContext } from "../../../../../../src/Interfaces";
import Model from "../../../../../../src/Model";
import { allow } from "../../../../../../src/Services";
import { ModelMiddleware } from "../../../../../../src/Types";

class Post extends Model {
  get fillable() {
    return {
      [HttpMethods.POST]: ["title", "content"],
      [HttpMethods.PUT]: ["content"],
    };
  }

  get validations() {
    return {
      [HttpMethods.POST]: {
        email: "required|email",
        name: "required",
      },
    };
  }

  get middlewares(): ModelMiddleware {
    return [
      {
        handler: [HandlerTypes.PAGINATE, HandlerTypes.INSERT],
        middleware: async (context: IContext) => {},
      },
    ];
  }

  get transaction() {
    return [
      {
        handlers: [HandlerTypes.INSERT],
        transaction: true,
      },
    ];
  }

  get limits() {
    return [allow(QueryFeature.All)];
  }

  comments() {
    return this.hasMany("Comment", "id", "post_id");
  }

  likes() {
    return this.hasMany("PostLike", "id", "post_id");
  }
}

export default Post;
