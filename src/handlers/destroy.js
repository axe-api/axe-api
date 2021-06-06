import { callHooks, addForeignKeyQuery } from "./helpers.js";
import { HOOK_FUNCTIONS } from "./../constants.js";
import HttpResponse from "./../core/HttpResponse.js";

export default async (context) => {
  const { request, response, model, trx, relation, parentModel } = context;

  const query = trx
    .from(model.instance.table)
    .where(
      model.instance.primaryKey,
      request.params[model.instance.primaryKey]
    );

  // If there is a relation, we should bind it
  addForeignKeyQuery(request, query, relation, parentModel);

  await callHooks(model, HOOK_FUNCTIONS.onBeforeDeleteQuery, {
    ...context,
    query,
  });

  let item = await query.first();
  if (!item) {
    throw new HttpResponse(404, `The item is not found on ${model.name}.`);
  }

  await callHooks(model, HOOK_FUNCTIONS.onAfterDeleteQuery, {
    ...context,
    query,
    item,
  });

  await callHooks(model, HOOK_FUNCTIONS.onBeforeDelete, {
    ...context,
    query,
    item,
  });

  await query.delete();

  await callHooks(model, HOOK_FUNCTIONS.onAfterDelete, {
    ...context,
    item,
  });

  return response.json();
};
