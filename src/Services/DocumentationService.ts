import { IModelService, IRouteDocumentation, IVersion } from "../Interfaces";
import { HandlerTypes, HttpMethods } from "../Enums";

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

  push(
    version: IVersion,
    handler: HandlerTypes,
    method: HttpMethods,
    url: string,
    model: IModelService
  ) {
    this.routes.push({
      version: version.name,
      handler,
      model: model.name,
      table: model.instance.table,
      columns: model.columns,
      hiddens: model.instance.hiddens,
      relations: model.relations,
      method,
      url,
      fillables: model.instance.getFillableFields(method),
      validations: model.instance.getValidationRules(method),
      queryLimits: model.queryLimits,
      queryDefaults: version.config?.query?.defaults ?? {},
    });
  }

  get(): IRouteDocumentation[] {
    return this.routes;
  }
}

export default DocumentationService;
