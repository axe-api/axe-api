import Model from "../../../../../../src/Model";
import { IRequestPack } from "../../../../../../src/Interfaces";
import { HandlerTypes } from "../../../../../../src/Enums";

class Login extends Model {
  get middlewares() {
    return [
      {
        handler: [HandlerTypes.PAGINATE, HandlerTypes.INSERT],
        middleware: async (context: IRequestPack) => {},
      },
      {
        handler: [HandlerTypes.PAGINATE, HandlerTypes.PATCH],
        middleware: async (context: IRequestPack) => {},
      },
    ];
  }
}

export default Login;
