import {
  addForeignKeyQuery,
  addSoftDeleteQuery,
  checkPrimaryKeyValueType,
} from "../../Handlers/Helpers";
import { IContext } from "../../Interfaces";
import { Knex } from "knex";

export default async (context: IContext) => {
  // We should check the parameter type
  const value = context.req.params[context.model.instance.primaryKey];
  checkPrimaryKeyValueType(context.model, value);

  // Adding the main query
  context.query = (context.database as Knex)
    .from(context.model.instance.table)
    .where(context.model.instance.primaryKey, value);

  // If there is a deletedAtColumn, it means that this table support soft-delete
  addSoftDeleteQuery(context.model, null, context.query);

  // If there is a relation, we should bind it
  addForeignKeyQuery(
    context.req,
    context.query,
    context.relation,
    context.parentModel,
  );
};
