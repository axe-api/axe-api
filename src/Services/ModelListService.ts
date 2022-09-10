import { IModelService } from "../Interfaces";

class ModelListService {
  private models: IModelService[];

  constructor(models: IModelService[]) {
    this.models = models;
  }

  find(name: string): IModelService | null {
    const found = this.models.find((i) => i.name === name);
    if (found) {
      return found;
    }

    return null;
  }

  get(): IModelService[] {
    return this.models;
  }
}

export default ModelListService;
