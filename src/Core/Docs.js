import { HTTP_METHODS } from "./../Constants.js";
import { getFormValidation } from "./../Controller/helpers.js";

class Docs {
  constructor() {
    this.routes = [];
  }

  push(method, url, model) {
    let fillable = undefined;
    let validations = undefined;

    if ([HTTP_METHODS.POST, HTTP_METHODS.PUT].includes(method)) {
      // Deteching fillable fields
      if (Array.isArray(model.instance.fillable)) {
        fillable = model.instance.fillable;
      } else {
        fillable = model.instance.fillable[method];
      }

      // Detecting validations
      if (model.instance.validations) {
        validations = getFormValidation(method, model.instance.validations);
      }
    }

    this.routes.push({
      model: model.name,
      table: model.instance.table,
      columns: model.instance.columns,
      method,
      url,
      fillable,
      validations,
    });
  }

  get() {
    return this.routes;
  }
}

export default Docs;
