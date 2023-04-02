import { NextFunction } from "express";
import Model from "../../../../../../src/Model";
import {
  IHandlerBaseMiddleware,
  AxeRequest,
  AxeResponse,
} from "../../../../../../src/Interfaces";
import { HandlerTypes } from "../../../../../../src/Enums";

class Login extends Model {
  get middlewares(): IHandlerBaseMiddleware[] {
    return [
      {
        handler: [HandlerTypes.PAGINATE, HandlerTypes.INSERT],
        middleware: (req: AxeRequest, res: AxeResponse, next: NextFunction) => {
          next();
        },
      },
      {
        handler: [HandlerTypes.PAGINATE, HandlerTypes.PATCH],
        middleware: (req: AxeRequest, res: AxeResponse, next: NextFunction) => {
          next();
        },
      },
    ];
  }
}

export default Login;
