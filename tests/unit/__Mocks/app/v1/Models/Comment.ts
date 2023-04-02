import { NextFunction } from "express";
import { QueryFeature } from "../../../../../../src/Enums";
import { AxeRequest, AxeResponse } from "../../../../../../src/Interfaces";
import Model from "../../../../../../src/Model";
import { allow } from "../../../../../../src/Services";

class Comment extends Model {
  get middlewares(): ((
    req: AxeRequest,
    res: AxeResponse,
    next: NextFunction
  ) => void)[] {
    return [
      (req: AxeRequest, res: AxeResponse, next: NextFunction) => {
        next();
      },
    ];
  }

  get transaction(): null {
    return null;
  }

  get limits() {
    return [allow(QueryFeature.All)];
  }

  author() {
    return this.hasOne("Author", "comment_id", "id");
  }
}

export default Comment;
