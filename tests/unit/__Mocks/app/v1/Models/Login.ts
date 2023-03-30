import { NextFunction } from "express";
import Model from "../../../../../../src/Model";
import { IHandlerBaseMiddleware, IRequest, IResponse } from "../../../../../../src/Interfaces";
import { HandlerTypes } from "../../../../../../src/Enums";

class Login extends Model {
  get middlewares(): IHandlerBaseMiddleware[] {
    return [
      {
        handler: [HandlerTypes.PAGINATE, HandlerTypes.INSERT],
        middleware: (req: IRequest, res: IResponse, next: NextFunction) => {
          next();
        },
      },
      {
        handler: [HandlerTypes.PAGINATE, HandlerTypes.PATCH],
        middleware: (req: IRequest, res: IResponse, next: NextFunction) => {
          next();
        },
      },
    ];
  }
}

export default Login;
