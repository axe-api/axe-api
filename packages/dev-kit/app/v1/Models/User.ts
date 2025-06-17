import { Model } from "axe-api";
import { users } from "../../generated-types";

class User extends Model {
  get primaryKey(): users.Columns {
    return "id";
  }
}

export default User;
