import { Knex } from "knex";
import { IContext } from "../../Interfaces";
import { addForeignKeyQuery, addSoftDeleteQuery } from "../../Handlers/Helpers";

export default async (context: IContext) => {
  context.query = (context.database as Knex).from(context.model.instance.table);

  // If there is a relation, we should bind it
  addForeignKeyQuery(
    context.req,
    context.query,
    context.relation,
    context.parentModel,
  );

  // If there is a deletedAtColumn, it means that this table support soft-delete
  addSoftDeleteQuery(context.model, null, context.query);
};
