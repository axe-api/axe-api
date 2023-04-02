import { NextFunction } from "express";
import {
  HandlerTypes,
  HttpMethods,
  QueryFeature,
} from "../../../../../../src/Enums";
import {
  IHandlerBasedTransactionConfig,
  IHandlerBaseMiddleware,
  IMethodBaseConfig,
  IMethodBaseValidations,
  IRequest,
  IResponse,
} from "../../../../../../src/Interfaces";
import Model from "../../../../../../src/Model";
import { allow } from "../../../../../../src/Services";

class Post extends Model {
  get fillable(): IMethodBaseConfig {
    return {
      [HttpMethods.POST]: ["title", "content"],
      [HttpMethods.PUT]: ["content"],
    };
  }

  get validations(): IMethodBaseValidations {
    return {
      [HttpMethods.POST]: {
        email: "required|email",
        name: "required",
      },
    };
  }

  get middlewares(): IHandlerBaseMiddleware {
    return {
      handler: [HandlerTypes.PAGINATE, HandlerTypes.INSERT],
      middleware: (req: IRequest, res: IResponse, next: NextFunction) => {
        next();
      },
    };
  }

  get transaction(): IHandlerBasedTransactionConfig {
    return {
      handler: HandlerTypes.INSERT,
      transaction: true,
    };
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
