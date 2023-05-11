const up = function (knex) {
  return knex.schema.createTable('lessons', function (table) {
    table.increments();
    table.string('name', 50).notNullable();
    table.timestamps();
  });
};

const down = function (knex) {
  return knex.schema.dropTable('lessons');
};

module.exports = { up, down };
