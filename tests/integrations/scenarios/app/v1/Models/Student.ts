import { Model, AxeRequest } from "axe-api";
import { Knex } from "knex";

class Student extends Model {
  get fillable() {
    return ["name", "phone"];
  }

  lessons() {
    return this.hasMany("StudentLesson", "id", "student_id", {
      onBeforeQuery: async (req: AxeRequest, query: Knex.QueryBuilder) => {
        query.orderBy("id", "desc");
      },
    });
  }
}

export default Student;
