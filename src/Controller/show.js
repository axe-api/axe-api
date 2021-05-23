import { callHooks, getParentColumn, getRelatedData } from "./helpers.js";
import { HOOK_FUNCTIONS } from "./../Constants.js";
import ApiError from "./../Exceptions/ApiError.js";

export default async (pack) => {
  const {
    request,
    response,
    model,
    models,
    queryParser,
    database,
    relation,
    parentModel,
  } = pack;

  // We should parse URL query string to use as condition in Lucid query
  const conditions = queryParser.get(request.query);

  // Fetching item
  const query = database.from(model.instance.table);

  // Users should be able to select some fields to show.
  queryParser.applyFields(query, conditions.fields);

  // If there is a relation, we should bind it
  if (relation && parentModel) {
    const parentColumn = getParentColumn(request);
    query.where(relation.foreignKey, request.params[parentColumn]);
  }

  // Users should be able to filter records
  queryParser.applyWheres(query, conditions.q);

  // // Users should be able to add relationships to the query
  // this.queryParser.applyRelations(query, conditions.with);

  // We should add this condition in here because of performance.
  query.where("id", request.params.id);

  await callHooks(model, HOOK_FUNCTIONS.onBeforeShow, {
    ...pack,
    query,
    conditions,
  });

  const item = await query.first();
  if (!item) {
    throw new ApiError(404, `The item is not found on ${model.name}.`);
  }

  // We should try to get related data if there is any
  await getRelatedData([item], conditions.with, model, models, database);

  await callHooks(model, HOOK_FUNCTIONS.onAfterShow, {
    ...pack,
    query,
    conditions,
    item,
  });

  return response.json(item);
};
