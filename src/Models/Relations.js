export const hasMany = (model, primaryKey = "id", foreignKey) => {
  if (!foreignKey) {
    foreignKey = model.toLowerCase();
  }
  return {
    type: "HasMany",
    model,
    primaryKey,
    foreignKey,
  };
};

export const hasOne = (model, primaryKey = "id", foreignKey) => {
  if (!foreignKey) {
    foreignKey = model.toLowerCase();
  }
  return {
    type: "HasOne",
    model,
    primaryKey,
    foreignKey,
  };
};
