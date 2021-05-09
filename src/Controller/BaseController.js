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

  async store(pack) {
    const { request, response, model, parentModel, Config, Database } = pack;
    // We should validate the data
    // await this.validation.validate(
    //   request.method(),
    //   request.all(),
    //   Model.validations
    // );

    // Preparing the data
    const formData = getFormData(request, model.instance.fillable);

    // // Binding parent id if there is.
    // if (request.adonisx.parent_column) {
    //   data[snakeCase(request.adonisx.parent_column)] =
    //     params[request.adonisx.parent_column];
    // }

    if (model.actions.onBeforeCreate) {
      await model.actions.onBeforeCreate({
        ...pack,
        formData,
      });
    }

    // this.event.fire(`onBeforeCreate${modelName}`, { request, params, data });

    // // Creating the item
    const [insertId] = await Database(model.instance.table).insert(formData);
    const item = await Database(model.instance.table)
      .where("id", insertId)
      .first();

    if (model.actions.onAfterCreate) {
      await model.actions.onAfterCreate({
        ...pack,
        formData,
        item,
      });
    }

    // this.event.fire(`onAfterCreate${modelName}`, {
    //   request,
    //   params,
    //   data,
    //   item,
    // });

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
