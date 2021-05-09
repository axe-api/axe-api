import { getFormData, getFormValidation, callHooks } from "./Helper.js";
import Validator from "validatorjs";
import { HOOK_FUNCTIONS } from "./../Constants.js";

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

  async show({ request, response, model, parentModel, Config, Database }) {
    response.json({
      name: "show",
      model,
      parentModel,
    });
  }

  async store(pack) {
    const { request, response, model, parentModel, Config, Database } = pack;

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

    response.json(item);
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
