import {
  callHooks,
  getRelatedData,
  filterHiddenFields,
  serializeData,
  addForeignKeyQuery,
} from "./helpers.js";
import { HOOK_FUNCTIONS, HANDLERS } from "./../constants.js";
import HttpResponse from "./../core/HttpResponse.js";
import QueryParser from "./../core/QueryParser.js";

export default async (context) => {
  const { request, response, model, models, trx, relation, parentModel } =
    context;
  const queryParser = new QueryParser({ model, models });

  // We should parse URL query string to use as condition in Lucid query
  const conditions = queryParser.get(request.query);

  // Fetching item
  const query = trx.from(model.instance.table);

  // Users should be able to select some fields to show.
  queryParser.applyFields(query, conditions.fields);

  // If there is a relation, we should bind it
  addForeignKeyQuery(request, query, relation, parentModel);

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

  // Users should be able to filter records
  queryParser.applyWheres(query, conditions.q);

  let item = await query.first();
  if (!item) {
    throw new HttpResponse(404, {
      message: `The item is not found on ${model.name}.`,
    });
  }

  // We should try to get related data if there is any
  await getRelatedData(
    [item],
    conditions.with,
    model,
    models,
    trx,
    HANDLERS.SHOW,
    request
  );

  await callHooks(model, HOOK_FUNCTIONS.onAfterShow, {
    ...context,
    query,
    conditions,
    item,
  });

  // Serializing the data by the model's serialize method
  item = await serializeData(
    item,
    model.instance.serialize,
    HANDLERS.SHOW,
    request
  );

  // Filtering hidden fields from the response data.
  filterHiddenFields([item], model.instance.hiddens);

  return response.json(item);
};
