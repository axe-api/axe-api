import { Model } from "axe-api";

class Lesson extends Model {
  get fillable() {
    return ["name"];
  }
}

export default Lesson;
