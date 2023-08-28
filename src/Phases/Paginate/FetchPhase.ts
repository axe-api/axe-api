import { addForeignKeyQuery } from "../../Handlers/Helpers";
import { IContext } from "../../Interfaces";

export default async (context: IContext) => {
  if (context.query && context.queryParser && context.conditions) {
    // Users should be able to select some fields to show.
    context.queryParser.applyFields(context.query, context.conditions.fields);

    // Binding parent id if there is.
    addForeignKeyQuery(
      context.req,
      context.query,
      context.relation,
      context.parentModel
    );

    // Users should be able to filter records
    context.queryParser.applyWheres(context.query, context.conditions.q);

    // User should be able to select sorting fields and types
    context.queryParser.applySorting(context.query, context.conditions.sort);
  }

  context.result = await (context.query as any).paginate({
    perPage: context.conditions?.per_page || 10,
    currentPage: context.conditions?.page || 1,
    isLengthAware: true,
  });
};
