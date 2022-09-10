const up = function (knex) {
  return knex.schema.createTable("exam_lesson_defaults", function (table) {
    table.increments();
    table.string("key_name").nullable();
    table.string("key_value").nullable();
    table.timestamps();
  });
};

const down = function (knex) {
  return knex.schema.dropTable("exam_lesson_defaults");
};

module.exports = { up, down };
