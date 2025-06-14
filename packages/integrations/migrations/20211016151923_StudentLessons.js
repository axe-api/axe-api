const up = function (knex) {
  return knex.schema.createTable("student_lessons", function (table) {
    table.increments();
    table.integer("student_id").unsigned().nullable();
    table.integer("lesson_id").unsigned().nullable();
    table.integer("teacher_id").unsigned().nullable();
    table.double("hour_per_month").unsigned().nullable();
    table.timestamps();

    table.foreign("student_id").references("students.id");
    table.foreign("lesson_id").references("lessons.id");
    table.foreign("teacher_id").references("teachers.id");
  });
};

const down = function (knex) {
  return knex.schema.dropTable("student_lessons");
};

module.exports = { up, down };
