import { Model } from "axe-api";

class RolePermission extends Model {
  get fillable() {
    return ["title"];
  }
}

export default RolePermission;
