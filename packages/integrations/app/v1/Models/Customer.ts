import { Model } from "axe-api";

class Customer extends Model {
  get table() {
    return "soft_delete_1";
  }

  get fillable() {
    return ["name"];
  }

  children() {
    return this.hasMany("Employee", "id", "parent_id");
  }
}

export default Customer;
