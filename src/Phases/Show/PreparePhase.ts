import { QueryService } from "../../Services";
import { IRequestPack } from "../../Interfaces";
import { Knex } from "knex";
import { addSoftDeleteQuery } from "../../Handlers/Helpers";

export default async (context: IRequestPack) => {
  context.queryParser = new QueryService(
    context.model,
    context.version.modelList.get(),
    context.version.config
  );

  // We should parse URL query string to use as condition in Lucid query
  context.conditions = context.queryParser.get(context.req.query);

  // Fetching item
  context.query = (context.database as Knex).from(context.model.instance.table);

  // If there is a deletedAtColumn, it means that this table support soft-delete
  addSoftDeleteQuery(context.model, context.conditions, context.query);
};
