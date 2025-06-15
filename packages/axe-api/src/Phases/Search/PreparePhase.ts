import { QueryService } from "../../Services";
import { IContext } from "../../Interfaces";
import { Knex } from "knex";

export default async (context: IContext) => {
  context.queryParser = new QueryService(
    context.model,
    context.version.modelList.get(),
    context.version.config,
  );

  // We should parse URL query string to use as condition in Lucid query
  context.conditions = context.queryParser.get(context.req.query);

  // Creating a new database query
  context.query = (context.database as Knex).from(context.model.instance.table);
};
