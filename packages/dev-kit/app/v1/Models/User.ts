import { Model } from "axe-api";

class User extends Model {
  get fillable() {
    return {
      PATCH: ["bio", "location", "name"],
    };
  }

  get validations() {
    return {
      PUT: {
        bio: "max:240",
        location: "required|min:2|max:2",
        name: "required|min:3|max:50",
      },
    };
  }
}

export default User;
