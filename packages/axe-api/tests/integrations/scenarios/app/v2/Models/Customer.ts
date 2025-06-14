import { Model, HandlerTypes, deny, QueryFeature } from "axe-api";

class Customer extends Model {
  get table() {
    return "soft_delete_1";
  }

  get fillable() {
    return ["name"];
  }

  get handlers() {
    return [HandlerTypes.ALL, HandlerTypes.PAGINATE];
  }

  get limits() {
    return [deny(QueryFeature.Sorting, ["name"])];
  }

  children() {
    return this.hasMany("Employee", "id", "parent_id");
  }
}

export default Customer;
