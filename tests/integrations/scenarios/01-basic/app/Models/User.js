import { Model } from "axe-api";

class User extends Model {
  get fillable() {
    return {
      POST: ["email", "name"],
      PUT: ["name"],
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
}

export default User;
