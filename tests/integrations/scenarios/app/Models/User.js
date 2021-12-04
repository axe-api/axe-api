import { Model, DEFAULT_HANDLERS, HANDLERS } from "axe-api";

class User extends Model {
  get fillable() {
    return {
      POST: ["email", "name", "surname"],
      PUT: ["name", "surname"],
    };
  }

  get validations() {
    return {
      POST: {
        email: "required|email",
        name: "required",
      },
    };
  }

  get handlers() {
    return [...DEFAULT_HANDLERS, HANDLERS.PATCH];
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

  serialize(item) {
    return {
      ...item,
      fullname: `${item.name} ${item.surname}`,
    };
  }
}

export default User;
