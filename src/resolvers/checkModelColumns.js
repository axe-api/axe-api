import { RELATIONSHIPS } from "./../constants.js";

const getModelFillableColumns = (model) => {
  if (!model.instance.fillable) {
    return [];
  }

  if (!model.instance.fillable.POST && !model.instance.fillable.PUT) {
    return model.instance.fillable;
  }

  return [...model.instance.fillable.POST, ...model.instance.fillable.PUT];
};

const getModelHiddenColumns = (model) => {
  if (!model.instance.hiddens) {
    return [];
  }

  return model.instance.hiddens;
};

const getModelFormValidationColumns = (model) => {
  if (!model.instance.validations) {
    return [];
  }

  if (!model.instance.validations.POST && !model.instance.validations.PUT) {
    return Object.keys(model.instance.validations);
  }

  return [
    ...Object.keys(
      model.instance.validations.POST ? model.instance.validations.POST : {}
    ),
    ...Object.keys(
      model.instance.validations.PUT ? model.instance.validations.PUT : {}
    ),
  ];
};

const getTimestampsColumns = (model) => {
  const columns = [];

  if (model.instance.createdAtColumn) {
    columns.push(model.instance.createdAtColumn);
  }

  if (model.instance.updatedAtColumn) {
    columns.push(model.instance.updatedAtColumn);
  }

  return columns;
};

const checkModelColumnsOrFail = (model, modelColumns) => {
  const undefinedColumns = modelColumns.filter(
    (modelColumn) => !model.instance.columnNames.includes(modelColumn)
  );
  if (undefinedColumns.length > 0) {
    throw new Error(
      `${
        model.name
      } model doesn't have the following columns on the database; "${
        model.instance.table
      }.${undefinedColumns.join(",")}"`
    );
  }
};

const checkHasManyRelation = (models, model, relation) => {
  checkModelColumnsOrFail(model, [relation.primaryKey]);
  const relatedModel = models.find((item) => item.name === relation.model);
  if (!relatedModel) {
    throw new Error(`Undefined related model: ${relation.model}`);
  }
  checkModelColumnsOrFail(relatedModel, [relation.foreignKey]);
};

const checkHasOneRelation = (models, model, relation) => {
  checkModelColumnsOrFail(model, [relation.foreignKey]);
  const relatedModel = models.find((item) => item.name === relation.model);
  if (!relatedModel) {
    throw new Error(`Undefined related model: ${relation.model}`);
  }
  checkModelColumnsOrFail(relatedModel, [relation.primaryKey]);
};

const checkerByRelationTypes = {
  [RELATIONSHIPS.HAS_MANY]: checkHasManyRelation,
  [RELATIONSHIPS.HAS_ONE]: checkHasOneRelation,
};

const checkRelationColumnsOrFail = (models, model) => {
  for (const relation of model.instance.relations) {
    const checker = checkerByRelationTypes[relation.type];
    if (!checker) {
      throw new Error(`Undefined relation type: ${relation.type}`);
    }
    checker(models, model, relation);
  }
};

export default (models) => {
  models.forEach((model) => {
    checkModelColumnsOrFail(model, getModelFillableColumns(model));
    checkModelColumnsOrFail(model, getModelFormValidationColumns(model));
    checkModelColumnsOrFail(model, getModelHiddenColumns(model));
    checkModelColumnsOrFail(model, getTimestampsColumns(model));
    checkModelColumnsOrFail(model, [model.instance.primaryKey]);
    checkRelationColumnsOrFail(models, model);
  });
};
