import { IModelService, IRouteDocumentation } from "../Interfaces";
import { HttpMethods } from "../Enums";

class DocumentationService {
  routes: IRouteDocumentation[];

  constructor() {
    this.routes = [];
  }

  push(method: HttpMethods, url: string, model: IModelService) {
    this.routes.push({
      model: model.name,
      table: model.instance.table,
      columns: model.columns,
      method,
      url,
      fillables: model.instance.getFillableFields(method),
      validations: model.instance.getValidationRules(method),
    });
  }

  get(): IRouteDocumentation[] {
    return this.routes;
  }
}

export default DocumentationService;
