import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { HandlerTypes, HttpMethods } from "../../../src/Enums";
import {
  IHandlerBasedTransactionConfig,
  IHandlerBaseMiddleware,
  IMethodBaseConfig,
  IMethodBaseValidations,
} from "../../../src/Interfaces";
import Model from "../../../src/Model";

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
      middleware: () => {},
    };
  }

  get transaction(): IHandlerBasedTransactionConfig {
    return {
      handler: HandlerTypes.INSERT,
      transaction: true,
    };
  }

  comments() {
    return this.hasMany("Comment", "id", "post_id");
  }

  likes() {
    return this.hasMany("PostLike", "id", "post_id");
  }
}

export default Post;
