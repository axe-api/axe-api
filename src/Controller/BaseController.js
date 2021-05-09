import { getFormData } from "./Helper.js";

class BaseController {
  async paginate({
    request,
    response,
    model,
    parentModel,
    Config,
    Database,
    Logger,
  }) {
    const result = await Database.select("*")
      .from(model.instance.table)
      .limit(5);

    response.json(result);
  }

  async show({ request, response, model, parentModel, Config, Database }) {
    response.json({
      name: "show",
      model,
      parentModel,
    });
  }

  async store({ request, response, model, parentModel, Config, Database }) {
    // We should validate the data
    // await this.validation.validate(
    //   request.method(),
    //   request.all(),
    //   Model.validations
    // );

    // Preparing the data
    const data = getFormData(request, model.instance.fillable);
    console.log(data);

    // // Binding parent id if there is.
    // if (request.adonisx.parent_column) {
    //   data[snakeCase(request.adonisx.parent_column)] =
    //     params[request.adonisx.parent_column];
    // }

    // // We should call onBeforeCreate action
    // const modelName = modelPath.replace("App/Models/", "");

    // await this.repositoryHelper.callAction(
    //   request.adonisx.url,
    //   "onBeforeCreate",
    //   { request, params, data }
    // );

    // this.event.fire(`onBeforeCreate${modelName}`, { request, params, data });

    // // Creating the item
    const [insertId] = await Database(model.instance.table).insert(data);
    const item = await Database(model.instance.table)
      .where("id", insertId)
      .first();

    // // We should call onAfterCreate action
    // await this.repositoryHelper.callAction(
    //   request.adonisx.url,
    //   "onAfterCreate",
    //   { request, params, data, item }
    // );

    // this.event.fire(`onAfterCreate${modelName}`, {
    //   request,
    //   params,
    //   data,
    //   item,
    // });

    // Returning response
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
