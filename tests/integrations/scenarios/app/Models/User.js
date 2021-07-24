import { Model } from "axe-api";

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

  posts() {
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
