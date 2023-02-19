import { Request, Response, NextFunction } from "express";
import { QueryFeature } from "../../../../../../src/Enums";
import Model from "../../../../../../src/Model";
import { allow } from "../../../../../../src/Services";

class Comment extends Model {
  get middlewares(): ((
    req: Request,
    res: Response,
    next: NextFunction
  ) => void)[] {
    return [
      (req: Request, res: Response, next: NextFunction) => {
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
