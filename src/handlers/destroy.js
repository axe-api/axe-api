import { callHooks, getParentColumn } from "./helpers.js";
import { HOOK_FUNCTIONS } from "./../Constants.js";
import HttpResponse from "./../core/HttpResponse.js";

export default async (pack) => {
  const { request, response, model, database, relation, parentModel } = pack;

  const query = database
    .from(model.instance.table)
    .where(
      model.instance.primaryKey,
      request.params[model.instance.primaryKey]
    );

  // If there is a relation, we should bind it
  if (relation && parentModel) {
    const parentColumn = getParentColumn(relation);
    query.where(relation.foreignKey, request.params[parentColumn]);
  }

  await callHooks(model, HOOK_FUNCTIONS.onBeforeDeleteQuery, {
    ...pack,
    query,
  });

  let item = await query.first();
  if (!item) {
    throw new HttpResponse(404, `The item is not found on ${model.name}.`);
  }

  await callHooks(model, HOOK_FUNCTIONS.onAfterDeleteQuery, {
    ...pack,
    query,
    item,
  });

  await callHooks(model, HOOK_FUNCTIONS.onBeforeDelete, {
    ...pack,
    query,
    item,
  });

  await query.delete();

  await callHooks(model, HOOK_FUNCTIONS.onAfterDelete, {
    ...pack,
    item,
  });

  return response.json();
};
