import { Relationships } from "../Enums";
import { IModelService } from "../Interfaces";
import { LogService, IoCService, ModelListService } from "../Services";

class ModelTreeBuilder {
  async build() {
    const logger = await IoCService.useByType<LogService>("LogService");
    const modelList: ModelListService =
      await IoCService.useByType<ModelListService>("ModelListService");
    const tree = this.getRootLevelOfTree(modelList);
    this.createRecursiveTree(tree, modelList);
    this.addNestedRoutes(tree, modelList);
    IoCService.singleton("ModelTree", () => tree);
    logger.info("Model tree has been created.");
  }

  private getRootLevelOfTree(modelList: ModelListService): IModelService[] {
    const childModels: string[] = [];
    modelList.get().forEach((model) => {
      childModels.push(
        ...model.relations
          .filter((relation) => relation.type === Relationships.HAS_MANY)
          .map((relation) => relation.model)
      );
    });

    return modelList.get().filter((model) => !childModels.includes(model.name));
  }

  private createRecursiveTree(
    tree: IModelService[],
    modelList: ModelListService
  ) {
    for (const model of tree) {
      this.setChildrens(model, modelList);
    }
  }

  private setChildrens(model: IModelService, modelList: ModelListService) {
    const childModelNames = this.getChildModelNames(model);
    model.children = modelList
      .get()
      .filter((item) => childModelNames.includes(item.name));
    for (const child of model.children) {
      this.setChildrens(child, modelList);
    }
  }

  private getChildModelNames(model: IModelService): string[] {
    return model.relations
      .filter((item) => item.type === Relationships.HAS_MANY)
      .map((item) => item.model);
  }

  private addNestedRoutes(tree: IModelService[], modelList: ModelListService) {
    // We should add recursive models
    modelList.get().forEach((model) => {
      const recursiveRelations = model.relations.filter(
        (relation) => relation.model === model.name
      );

      if (recursiveRelations.length === 2) {
        tree.push({
          ...model,
          isRecursive: true,
          children: [],
        });
      }
    });
  }
}

export default ModelTreeBuilder;
