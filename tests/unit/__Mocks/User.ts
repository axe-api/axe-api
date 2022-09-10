import {
  IHandlerBasedTransactionConfig,
  IMethodBaseConfig,
} from "../../../src/Interfaces";
import Model from "../../../src/Model";

class User extends Model {
  get fillable(): string[] {
    return ["name", "surname"];
  }

  get transaction(): boolean {
    return true;
  }

  posts() {
    return this.hasMany("Post", "id", "user_id");
  }

  logins() {
    return this.hasMany("Login", "id", "user_id");
  }
}

export default User;
