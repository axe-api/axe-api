import { QueryService } from "../../Services";
import { IRequestPack } from "../../Interfaces";
import { Knex } from "knex";
import {
  addForeignKeyQuery,
  addSoftDeleteQuery,
  checkPrimaryKeyValueType,
} from "../../Handlers/Helpers";

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

  // Users should be able to select some fields to show.
  context.queryParser.applyFields(context.query, context.conditions.fields);

  // If there is a relation, we should bind it
  addForeignKeyQuery(
    context.req,
    context.query,
    context.relation,
    context.parentModel
  );

  // We should check the parameter type
  const value = context.params[context.model.instance.primaryKey];
  checkPrimaryKeyValueType(context.model, value);

  // Adding the main query
  context.query.where(context.model.instance.primaryKey, value);
};
