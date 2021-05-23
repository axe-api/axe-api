import pluralize from "pluralize";
import { RELATIONSHIPS, HANDLERS } from "./../Constants.js";
const { INSERT, SHOW, UPDATE, PAGINATE, DELETE } = HANDLERS;

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

  get handlers() {
    return [INSERT, SHOW, PAGINATE, UPDATE, DELETE];
  }

  get middlewares() {
    return [];
  }

  get hiddens() {
    return [];
  }

  get createdAtColumn() {
    return "created_at";
  }

  get updatedAtColumn() {
    return "updated_at";
  }

  hasMany(relatedModel, primaryKey = "id", foreignKey = null) {
    if (!foreignKey) {
      const currentModelName = pluralize.singular(
        this.constructor.name.toLowerCase()
      );
      foreignKey = `${currentModelName}_id`;
    }
    return {
      type: RELATIONSHIPS.HAS_MANY,
      model: relatedModel,
      primaryKey,
      foreignKey,
    };
  }

  hasOne(relatedModel, primaryKey = "id", foreignKey = null) {
    if (!foreignKey) {
      foreignKey = `${pluralize.singular(relatedModel.toLowerCase())}_id`;
    }
    return {
      type: RELATIONSHIPS.HAS_ONE,
      model: relatedModel,
      primaryKey,
      foreignKey,
    };
  }

  belongsTo(relatedModel, primaryKey, foreignKey) {
    return this.hasOne(relatedModel, foreignKey, primaryKey);
  }
}

export default Model;
