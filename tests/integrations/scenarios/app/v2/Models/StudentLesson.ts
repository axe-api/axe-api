import { Model } from "axe-api";

class StudentLesson extends Model {
  get fillable() {
    return ["lesson_id", "teacher_id", "hour_per_month"];
  }

  student() {
    return this.belongsTo("Student", "student_id", "id");
  }

  lesson() {
    return this.belongsTo("Lesson", "lesson_id", "id");
  }

  teacher() {
    return this.belongsTo("Teacher", "teacher_id", "id");
  }
}

export default StudentLesson;
