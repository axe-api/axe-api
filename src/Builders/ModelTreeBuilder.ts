import { Relationships } from "../Enums";
import { IModelService, IVersion } from "../Interfaces";
import { LogService } from "../Services";

class ModelTreeBuilder {
  private version: IVersion;

  constructor(version: IVersion) {
    this.version = version;
  }

  async build() {
    const logger = LogService.getInstance();
    const tree = this.getRootLevelOfTree();
    this.createRecursiveTree(tree);
    this.addNestedRoutes(tree);
    this.version.modelTree = tree;
    logger.info(`[${this.version.name}] Model tree has been created.`);
  }

  private getRootLevelOfTree(): IModelService[] {
    const childModels: string[] = [];
    this.version.modelList.get().forEach((model) => {
      childModels.push(
        ...model.relations
          .filter((relation) => relation.type === Relationships.HAS_MANY)
          .map((relation) => relation.model)
      );
    });

    return this.version.modelList
      .get()
      .filter((model) => !childModels.includes(model.name));
  }

  private createRecursiveTree(tree: IModelService[]) {
    for (const model of tree) {
      this.setChildrens(model);
    }
  }

  private setChildrens(model: IModelService) {
    const childModelNames = this.getChildModelNames(model);
    model.children = this.version.modelList
      .get()
      .filter((item) => childModelNames.includes(item.name));
    for (const child of model.children) {
      this.setChildrens(child);
    }
  }

  private getChildModelNames(model: IModelService): string[] {
    return model.relations
      .filter((item) => item.type === Relationships.HAS_MANY)
      .map((item) => item.model);
  }

  private addNestedRoutes(tree: IModelService[]) {
    // We should add recursive models
    this.version.modelList.get().forEach((model) => {
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
