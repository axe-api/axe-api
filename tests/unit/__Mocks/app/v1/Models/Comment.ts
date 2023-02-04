import { Request, Response, NextFunction } from "express";
import Model from "../../../../../../src/Model";

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

  author() {
    return this.hasOne("Author", "comment_id", "id");
  }
}

export default Comment;
