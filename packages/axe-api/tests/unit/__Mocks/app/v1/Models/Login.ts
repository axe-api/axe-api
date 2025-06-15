import Model from "../../../../../../src/Model";
import { IContext } from "../../../../../../src/Interfaces";
import { HandlerTypes } from "../../../../../../src/Enums";

class Login extends Model {
  get middlewares() {
    return [
      {
        handler: [HandlerTypes.PAGINATE, HandlerTypes.INSERT],
        middleware: async (context: IContext) => {},
      },
      {
        handler: [HandlerTypes.PAGINATE, HandlerTypes.PATCH],
        middleware: async (context: IContext) => {},
      },
    ];
  }
}

export default Login;
