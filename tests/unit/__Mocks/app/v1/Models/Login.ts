import { Request, Response, NextFunction } from "express";
import Model from "../../../../../../src/Model";
import {
  IHandlerBaseMiddleware,
  IRequestPack,
} from "../../../../../../src/Interfaces";
import { HandlerTypes } from "../../../../../../src/Enums";

class Login extends Model {
  get middlewares() {
    return [
      {
        handler: [HandlerTypes.PAGINATE, HandlerTypes.INSERT],
        middleware: async (pack: IRequestPack) => {},
      },
      {
        handler: [HandlerTypes.PAGINATE, HandlerTypes.PATCH],
        middleware: async (pack: IRequestPack) => {},
      },
    ];
  }
}

export default Login;
