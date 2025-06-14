import {
  ICustomRouteDocumentation,
  IModelService,
  IRouteDocumentation,
  IVersion,
} from "../Interfaces";
import { HandlerTypes, HttpMethods } from "../Enums";

class DocumentationService {
  private static instance: DocumentationService;
  private routes: IRouteDocumentation[];
  private customRoutes: ICustomRouteDocumentation[];

  constructor() {
    this.routes = [];
    this.customRoutes = [];
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
    model: IModelService,
    parentModel: IModelService | null,
  ) {
    this.routes.push({
      version: version.name,
      handler,
      modelService: model,
      parentModel,
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

  pushCustom(method: HttpMethods, url: string) {
    this.customRoutes.push({
      method,
      url,
    });
  }

  get(): IRouteDocumentation[] {
    return this.routes;
  }

  getCustoms(): ICustomRouteDocumentation[] {
    return this.customRoutes;
  }
}

export default DocumentationService;
