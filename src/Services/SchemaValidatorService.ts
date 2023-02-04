import AxeError from "../Exceptions/AxeError";
import { AxeErrorCode, Relationships } from "../Enums";
import {
  IRelation,
  IMethodBaseConfig,
  IMethodBaseValidations,
  IModelService,
  IVersion,
} from "../Interfaces";
import { LogService, ModelListService } from "../Services";

class SchemaValidatorService {
  private version: IVersion;

  constructor(version: IVersion) {
    this.version = version;
  }

  async validate() {
    const logger = LogService.getInstance();
    this.version.modelList.get().forEach((model) => {
      this.checkModelColumnsOrFail(model, this.getModelFillableColumns(model));
      this.checkModelColumnsOrFail(
        model,
        this.getModelFormValidationColumns(model)
      );
      this.checkModelColumnsOrFail(model, this.getModelHiddenColumns(model));
      this.checkModelColumnsOrFail(model, this.getTimestampsColumns(model));
      this.checkModelColumnsOrFail(model, [model.instance.primaryKey]);
      this.checkRelationColumnsOrFail(this.version.modelList, model);
    });
    logger.info(`[${this.version.name}] Database schema has been validated.`);
  }

  private checkModelColumnsOrFail(
    model: IModelService,
    modelColumns: string[]
  ) {
    const undefinedColumns = modelColumns.filter(
      (modelColumn) => !model.columnNames.includes(modelColumn)
    );
    if (undefinedColumns.length > 0) {
      throw new AxeError(
        AxeErrorCode.UNDEFINED_COLUMN,
        `${
          model.name
        } model doesn't have the following columns on the database; "${
          model.instance.table
        }.${undefinedColumns.join(",")}"`
      );
    }
  }

  private getModelFillableColumns = (model: IModelService): string[] => {
    const fillable = model.instance.fillable;

    if (!fillable) {
      return [];
    }

    if (Array.isArray(fillable)) {
      return fillable;
    }

    const config = fillable as IMethodBaseConfig;
    return [
      ...(config.POST || []),
      ...(config.PUT || []),
      ...(config.PATCH || []),
    ];
  };

  private getModelFormValidationColumns = (model: IModelService): string[] => {
    const validations = model.instance.validations;
    if (!validations) {
      return [];
    }

    const objValidations = validations as any;
    if (!objValidations.POST && !objValidations.PUT) {
      return Object.keys(objValidations);
    }

    const config = validations as IMethodBaseValidations;

    return [
      ...Object.keys(config.POST ? config.POST : {}),
      ...Object.keys(config.PUT ? config.PUT : {}),
    ];
  };

  private getModelHiddenColumns = (model: IModelService): string[] => {
    if (!model.instance.hiddens) {
      return [];
    }

    return model.instance.hiddens;
  };

  private getTimestampsColumns = (model: IModelService): string[] => {
    const columns: string[] = [];

    if (model.instance.createdAtColumn) {
      columns.push(model.instance.createdAtColumn);
    }

    if (model.instance.updatedAtColumn) {
      columns.push(model.instance.updatedAtColumn);
    }

    if (model.instance.deletedAtColumn) {
      columns.push(model.instance.deletedAtColumn);
    }

    return columns;
  };

  private checkRelationColumnsOrFail(
    modelList: ModelListService,
    model: IModelService
  ) {
    for (const relation of model.relations) {
      if (relation.type === Relationships.HAS_MANY) {
        this.checkHasManyRelation(modelList, model, relation);
      } else if (relation.type === Relationships.HAS_ONE) {
        this.checkHasOneRelation(modelList, model, relation);
      } else {
        throw new Error(`Undefined relation type: ${relation.type}`);
      }
    }
  }

  private checkHasManyRelation = (
    modelList: ModelListService,
    model: IModelService,
    relation: IRelation
  ) => {
    this.checkModelColumnsOrFail(model, [relation.primaryKey]);
    const relatedModel = modelList.find(relation.model);
    if (!relatedModel) {
      throw new AxeError(
        AxeErrorCode.UNDEFINED_RELATION_MODEL,
        `Undefined related model: ${relation.model} (${model.name}.${relation.name})`
      );
    }
    this.checkModelColumnsOrFail(relatedModel, [relation.foreignKey]);
  };

  private checkHasOneRelation(
    modelList: ModelListService,
    model: IModelService,
    relation: IRelation
  ) {
    this.checkModelColumnsOrFail(model, [relation.foreignKey]);
    const relatedModel = modelList.find(relation.model);
    if (!relatedModel) {
      throw new Error(`Undefined related model: ${relation.model}`);
    }
    this.checkModelColumnsOrFail(relatedModel, [relation.primaryKey]);
  }
}

export default SchemaValidatorService;
