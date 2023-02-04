import { Model, DEFAULT_HANDLERS, HandlerTypes } from "axe-api";

class EmployeeAddress extends Model {
  get table() {
    return "soft_delete_3";
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

  parent() {
    return this.belongsTo("Employee", "parent_id", "id");
  }
}

export default EmployeeAddress;
