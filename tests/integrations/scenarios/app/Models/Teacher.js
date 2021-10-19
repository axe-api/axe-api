import { Model } from "axe-api";

class Teacher extends Model {
  get fillable() {
    return ["name", "phone", "email"];
  }
}

export default Teacher;
