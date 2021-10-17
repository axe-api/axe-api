export const up = function (knex) {
  return knex.schema.createTable("students", function (table) {
    table.increments();
    table.string("name", 100).notNullable();
    table.string("phone", 10).notNullable();
    table.timestamps();
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("students");
};
