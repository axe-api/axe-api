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

const checkOrFailModelColumns = (model, modelColumns) => {
  const undefinedColumns = modelColumns.filter(
    (modelColumn) => !model.instance.columnNames.includes(modelColumn)
  );
  if (undefinedColumns.length > 0) {
    throw new Error(
      `${
        model.name
      } model doesn't have the following columns on the database; ${undefinedColumns.join(
        ","
      )}`
    );
  }
};

export default (models) => {
  models.forEach((model) => {
    checkOrFailModelColumns(model, getModelFillableColumns(model));
    checkOrFailModelColumns(model, getModelFormValidationColumns(model));
    checkOrFailModelColumns(model, getModelHiddenColumns(model));
    checkOrFailModelColumns(model, getTimestampsColumns(model));
  });
};
