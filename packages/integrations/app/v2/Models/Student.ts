import { Model } from "axe-api";

class Student extends Model {
  get fillable() {
    return ["name", "phone"];
  }

  lessons() {
    return this.hasMany("StudentLesson", "id", "student_id");
  }
}

export default Student;
