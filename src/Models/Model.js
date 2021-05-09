import pluralize from "pluralize";
import { RELATIONSHIPS } from "./../Constants.js";

class Model {
  constructor() {
    this.relations = [];
  }

  get table() {
    return pluralize(this.constructor.name.toLowerCase());
  }

  get fillable() {
    return [];
  }

  get validations() {
    return null;
  }

  get actions() {
    return ["GET", "POST", "PUT", "DELETE"];
  }

  hasMany(model, primaryKey = "id", foreignKey) {
    if (!foreignKey) {
      foreignKey = model.toLowerCase();
    }
    return {
      type: RELATIONSHIPS.HAS_MANY,
      model,
      primaryKey,
      foreignKey,
    };
  }

  hasOne(model, primaryKey = "id", foreignKey) {
    if (!foreignKey) {
      foreignKey = model.toLowerCase();
    }
    return {
      type: RELATIONSHIPS.HAS_ONE,
      model,
      primaryKey,
      foreignKey,
    };
  }
}

export default Model;
