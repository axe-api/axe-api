import { IContext, IModelService } from "../Interfaces";
import URLService from "../Services/URLService";
import { StatusCodes } from "../Enums";

const queryByPrimaryKey = async (
  content: IContext,
  queryModel: IModelService,
  value: any,
) => {
  const { database } = content;
  return database
    .from(queryModel.instance.table)
    .where(queryModel.instance.primaryKey, value)
    .first();
};

export default async (context: IContext) => {
  const { req, res } = context;

  const match = URLService.match(req);
  if (match) {
    const promises = match.parentPairs.map((pair) =>
      queryByPrimaryKey(context, pair.model, match.params[pair.paramName]),
    );
    const results = await Promise.all(promises);
    const isMissing = results.some((item) => !item);
    if (isMissing) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "The resource is not found" });
    }
  }
};
