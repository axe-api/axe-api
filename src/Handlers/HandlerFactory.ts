import { IRequestPack } from "../Interfaces";
import AllHandler from "./AllHandler";
import DestroyHandler from "./DestroyHandler";
import ForceDestroyHandler from "./ForceDestroyHandler";
import PaginateHandler from "./PaginateHandler";
import PatchHandler from "./PatchHandler";
import UpdateHandler from "./UpdateHandler";
import ShowHandler from "./ShowHandler";
import StoreHandler from "./StoreHandler";
import { HandlerTypes } from "../Enums";

class HandlerFactory {
  static get(handleType: HandlerTypes): (pack: IRequestPack) => void {
    switch (handleType) {
      case HandlerTypes.ALL:
        return AllHandler;
      case HandlerTypes.DELETE:
        return DestroyHandler;
      case HandlerTypes.FORCE_DELETE:
        return ForceDestroyHandler;
      case HandlerTypes.INSERT:
        return StoreHandler;
      case HandlerTypes.PAGINATE:
        return PaginateHandler;
      case HandlerTypes.PATCH:
        return PatchHandler;
      case HandlerTypes.SHOW:
        return ShowHandler;
      case HandlerTypes.UPDATE:
        return UpdateHandler;
      default:
        throw new Error("Handler type is not defined");
    }
  }
}

export default HandlerFactory;
