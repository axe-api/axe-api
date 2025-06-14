import { Model, DEFAULT_HANDLERS, HandlerTypes } from "axe-api";

class Category extends Model {
  get fillable() {
    return ["title"];
  }

  get handlers() {
    return [...DEFAULT_HANDLERS, HandlerTypes.ALL];
  }

  categories() {
    return this.hasMany("Category", "id", "parent_id");
  }

  category() {
    return this.belongsTo("Category", "parent_id", "id");
  }
}

export default Category;
