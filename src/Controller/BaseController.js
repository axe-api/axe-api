import { getFormData, getFormValidation, callHooks } from "./Helper.js";
import Validator from "validatorjs";
import { HOOK_FUNCTIONS } from "./../Constants.js";
import ApiError from "./../Exceptions/ApiError.js";

class BaseController {
  async paginate(pack) {
    const { request, response, model, Database, QueryParser } = pack;

    // We should parse URL query string to use as condition in Lucid query
    const conditions = QueryParser.get(request.query);

    // Creating a new database query
    const query = Database.from(model.instance.table);

    // Users should be able to select some fields to show.
    QueryParser.applyFields(query, conditions.fields);

    // this.repositoryHelper.addParentIdCondition(
    //   query,
    //   params,
    //   request.adonisx.parent_column
    // );

    // Users should be able to filter records
    QueryParser.applyWheres(query, conditions.q);

    // // Users should be able to add relationships to the query
    // this.queryParser.applyRelations(query, conditions.with);

    await callHooks(model, HOOK_FUNCTIONS.onBeforePaginate, {
      ...pack,
      conditions,
      query,
    });

    // User should be able to select sorting fields and types
    QueryParser.applySorting(query, conditions.sort);

    // Executing query
    const result = await query.paginate({
      perPage: conditions.per_page,
      currentPage: conditions.page,
    });

    await callHooks(model, HOOK_FUNCTIONS.onAfterPaginate, {
      ...pack,
      result,
      conditions,
      query,
    });

    return response.json(result);
  }

  async show(pack) {
    const { request, response, model, Database, QueryParser } = pack;
    // We should parse URL query string to use as condition in Lucid query
    const conditions = QueryParser.get(request.query);

    // Fetching item
    const query = Database.from(model.instance.table);

    // Users should be able to select some fields to show.
    QueryParser.applyFields(query, conditions.fields);

    // this.repositoryHelper.addParentIdCondition(
    //   query,
    //   params,
    //   request.adonisx.parent_column
    // );

    // Users should be able to filter records
    QueryParser.applyWheres(query, conditions.q);

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

    await callHooks(model, HOOK_FUNCTIONS.onAfterShow, {
      ...pack,
      query,
      conditions,
      item,
    });

    return response.json(item);
  }

  async store(pack) {
    const { request, response, model, Database } = pack;

    const formData = getFormData(request, model.instance.fillable);
    const formValidationRules = getFormValidation(
      request,
      model.instance.validations
    );

    if (formValidationRules) {
      const validation = new Validator(formData, formValidationRules);
      if (validation.fails()) {
        return response.status(400).json(validation.errors);
      }
    }

    // // Binding parent id if there is.
    // if (request.adonisx.parent_column) {
    //   data[snakeCase(request.adonisx.parent_column)] =
    //     params[request.adonisx.parent_column];
    // }

    await callHooks(model, HOOK_FUNCTIONS.onBeforeCreate, {
      ...pack,
      formData,
    });

    const [insertId] = await Database(model.instance.table).insert(formData);
    const item = await Database(model.instance.table)
      .where("id", insertId)
      .first();

    await callHooks(model, HOOK_FUNCTIONS.onAfterCreate, {
      ...pack,
      formData,
      item,
    });

    return response.json(item);
  }

  async update({ request, response, model, parentModel, Config, Database }) {
    response.json({
      name: "update",
      model,
      parentModel,
    });
  }

  async delete({ request, response, model, parentModel, Config, Database }) {
    response.json({
      name: "delete",
      model,
      parentModel,
    });
  }
}

export default BaseController;
