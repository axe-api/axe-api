import { IModelService, IRouteDocumentation } from "../Interfaces";
import { HttpMethods } from "../Enums";

class DocumentationService {
  private static instance: DocumentationService;
  private routes: IRouteDocumentation[];

  constructor() {
    this.routes = [];
  }

  static getInstance(): DocumentationService {
    if (!DocumentationService.instance) {
      DocumentationService.instance = new DocumentationService();
    }

    return DocumentationService.instance;
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
