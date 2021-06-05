import {
  callHooks,
  getParentColumn,
  getRelatedData,
  filterHiddenFields,
  serializeData,
} from "./helpers.js";
import { HOOK_FUNCTIONS } from "./../Constants.js";
import HttpResponse from "./../core/HttpResponse.js";
import QueryParser from "./../core/QueryParser.js";

export default async (context) => {
  const { request, response, model, models, database, relation, parentModel } =
    context;
  const queryParser = new QueryParser();

  // We should parse URL query string to use as condition in Lucid query
  const conditions = queryParser.get(model, request.query);

  // Fetching item
  const query = database.from(model.instance.table);

  // Users should be able to select some fields to show.
  queryParser.applyFields(query, conditions.fields);

  // If there is a relation, we should bind it
  if (relation && parentModel) {
    const parentColumn = getParentColumn(relation);
    query.where(relation.foreignKey, request.params[parentColumn]);
  }

  // Users should be able to filter records
  queryParser.applyWheres(query, conditions.q);

  // // Users should be able to add relationships to the query
  // this.queryParser.applyRelations(query, conditions.with);

  // We should add this condition in here because of performance.
  query.where(
    model.instance.primaryKey,
    request.params[model.instance.primaryKey]
  );

  await callHooks(model, HOOK_FUNCTIONS.onBeforeShow, {
    ...context,
    query,
    conditions,
  });

  let item = await query.first();
  if (!item) {
    throw new HttpResponse(404, `The item is not found on ${model.name}.`);
  }

  // We should try to get related data if there is any
  await getRelatedData([item], conditions.with, model, models, database);

  await callHooks(model, HOOK_FUNCTIONS.onAfterShow, {
    ...context,
    query,
    conditions,
    item,
  });

  // Serializing the data by the model's serialize method
  item = serializeData(item, model.instance.serialize);

  // Filtering hidden fields from the response data.
  filterHiddenFields([item], model.instance.hiddens);

  return response.json(item);
};
