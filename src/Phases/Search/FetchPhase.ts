import { Knex } from "knex";
import { IoCService } from "../../Services";
import { IContext } from "../../Interfaces";
import ElasticService from "../../Services/ElasticService";
import { StatusCodes } from "../../Enums";

export default async (context: IContext) => {
  const { req, res, model, database, relation, parentModel } = context;
  if (!context.query || !context.queryParser || !context.conditions) {
    return res.status(500).json({ error: "Query is not parsed!" });
  }

  const { page, per_page, text } = context.conditions;

  // The text parameter is required
  if (!text || text.trim().length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "`text` parameter is required" });
  }

  const elastic = await IoCService.use<ElasticService>("Elastic");

  // We are using the default query prepare strategy. But developers are able to
  // create their own custom logic if they want.
  const esQuery = model.instance.getSearchQuery({
    req,
    model,
    relation,
    parentModel,
    text: text || "",
  });

  // Getting the data from Elastic Search
  const result = await elastic.search(model.name, page, per_page, esQuery);
  const ids = result.hits.hits.map((item: any) => item._id);

  // Preparing the query to fetch the items via database
  context.query = (database as Knex)
    .from(context.model.instance.table)
    .whereIn(model.instance.primaryKey, ids);

  // Users should be able to select some fields to show.
  context.queryParser.applyFields(context.query, context.conditions.fields);

  // Fetching the data
  const data = await context.query;

  // Calculating the pagination values
  const from = (page - 1) * per_page;
  const to = from + per_page;
  const total: number = result.hits.total
    ? (result.hits.total as any)?.value
    : 1;

  // Creates the reesponses
  context.result = {
    data,
    pagination: {
      total,
      lastPage: Math.ceil(total / per_page),
      per_page,
      currentPage: page,
      from,
      to,
    },
  };
};
