import { IContext } from "../../Interfaces";

export default async (context: IContext) => {
  if (context.query) {
    // If there is a deletedAtColumn, it means that this table support soft-delete
    if (context.model.instance.deletedAtColumn) {
      await context.query.update({
        [context.model.instance.deletedAtColumn]: new Date(),
      });
    } else {
      await context.query.delete();
    }
  }
};
