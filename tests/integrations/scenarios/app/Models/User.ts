import {
  Model,
  DEFAULT_HANDLERS,
  HandlerTypes,
  IMethodBaseValidations,
  HttpMethods,
} from "axe-api";

class User extends Model {
  get fillable() {
    return {
      POST: ["email", "name", "surname"],
      PUT: ["name", "surname"],
    };
  }

  get validations(): IMethodBaseValidations {
    return {
      [HttpMethods.POST]: {
        email: "required|email",
        name: "required",
      },
    };
  }

  get handlers() {
    return [...DEFAULT_HANDLERS, HandlerTypes.PATCH];
  }

  get hiddens() {
    return ["password_salt", "password_hash"];
  }

  posts() {
    return this.hasMany("Post", "id", "user_id");
  }

  ownedPosts() {
    return this.hasMany("Post", "id", "user_id");
  }

  suggestedPosts() {
    return this.hasMany("Post", "id", "user_id");
  }
}

export default User;
