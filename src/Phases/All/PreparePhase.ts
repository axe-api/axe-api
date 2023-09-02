import { QueryService } from "../../Services";
import { IContext } from "../../Interfaces";
import { Knex } from "knex";
import { addForeignKeyQuery, addSoftDeleteQuery } from "../../Handlers/Helpers";

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

  // If there is a deletedAtColumn, it means that this table support soft-delete
  addSoftDeleteQuery(context.model, context.conditions, context.query);

  // Users should be able to select some fields to show.
  context.queryParser.applyFields(context.query, context.conditions.fields);

  // Binding parent id if there is.
  addForeignKeyQuery(
    context.req,
    context.query,
    context.relation,
    context.parentModel,
  );

  // Users should be able to filter records
  context.queryParser.applyWheres(context.query, context.conditions.q);

  // User should be able to select sorting fields and types
  context.queryParser.applySorting(context.query, context.conditions.sort);
};
