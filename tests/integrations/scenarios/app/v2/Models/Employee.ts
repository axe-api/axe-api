import { Model, DEFAULT_HANDLERS, HandlerTypes } from "axe-api";

class Employee extends Model {
  get table() {
    return "soft_delete_2";
  }

  get fillable() {
    return ["name"];
  }

  get deletedAtColumn() {
    return "deleted_at";
  }

  get handlers() {
    return [...DEFAULT_HANDLERS, HandlerTypes.ALL, HandlerTypes.FORCE_DELETE];
  }

  children() {
    return this.hasMany("EmployeeAddress", "id", "parent_id");
  }

  parent() {
    return this.belongsTo("Customer", "parent_id", "id");
  }
}

export default Employee;
