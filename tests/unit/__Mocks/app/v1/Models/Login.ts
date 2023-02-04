import { Request, Response, NextFunction } from "express";
import Model from "../../../../../../src/Model";
import { IHandlerBaseMiddleware } from "../../../../../../src/Interfaces";
import { HandlerTypes } from "../../../../../../src/Enums";

class Login extends Model {
  get middlewares(): IHandlerBaseMiddleware[] {
    return [
      {
        handler: [HandlerTypes.PAGINATE, HandlerTypes.INSERT],
        middleware: (req: Request, res: Response, next: NextFunction) => {
          next();
        },
      },
      {
        handler: [HandlerTypes.PAGINATE, HandlerTypes.PATCH],
        middleware: (req: Request, res: Response, next: NextFunction) => {
          next();
        },
      },
    ];
  }
}

export default Login;
