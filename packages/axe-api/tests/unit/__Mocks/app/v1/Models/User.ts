import { QueryFeature } from "../../../../../../src/Enums";
import Model from "../../../../../../src/Model";
import { allow } from "../../../../../../src/Services";

class User extends Model {
  get fillable(): string[] {
    return ["name", "surname"];
  }

  get transaction(): boolean {
    return true;
  }

  get limits() {
    return [allow(QueryFeature.All)];
  }

  posts() {
    return this.hasMany("Post", "id", "user_id");
  }

  logins() {
    return this.hasMany("Login", "id", "user_id");
  }
}

export default User;
