class BaseController {
  async paginate({ request, response, model, parentModel, Config, Database }) {
    console.log(Config);
    const result = await Database.select(["id", "name", "email"])
      .from(model.instance.table)
      .where("id", ">", 100)
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
    response.json({
      name: "store",
      model,
      parentModel,
    });
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
