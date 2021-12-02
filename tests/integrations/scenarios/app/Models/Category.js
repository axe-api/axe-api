import { Model } from "axe-api";

class Category extends Model {
  get fillable() {
    return ["title"];
  }

  categories() {
    return this.hasMany("Category", "id", "parent_id");
  }

  category() {
    return this.belongsTo("Category", "parent_id", "id");
  }
}

export default Category;
