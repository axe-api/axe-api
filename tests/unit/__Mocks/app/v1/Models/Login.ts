import Model from "../../../../../../src/Model";
import { IRequestPack } from "../../../../../../src/Interfaces";
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
