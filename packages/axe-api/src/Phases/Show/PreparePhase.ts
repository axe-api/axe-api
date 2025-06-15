import { QueryService } from "../../Services";
import { IContext } from "../../Interfaces";
import { addSoftDeleteQuery } from "../../Handlers/Helpers";

export default async (context: IContext) => {
  const { req, model, version, database } = context;

  context.queryParser = new QueryService(
    model,
    version.modelList.get(),
    version.config,
  );

  // We should parse URL query string to use as condition in Lucid query
  context.conditions = context.queryParser.get(req.query);

  // Fetching item
  context.query = database.from(model.instance.table);

  // If there is a deletedAtColumn, it means that this table support soft-delete
  addSoftDeleteQuery(model, context.conditions, context.query);
};
