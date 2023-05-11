const up = function (knex) {
  return knex.schema.createTable('teachers', function (table) {
    table.increments();
    table.string('name', 100).notNullable();
    table.string('phone', 10).nullable();
    table.string('email', 255).nullable();
    table.timestamps();
  });
};

const down = function (knex) {
  return knex.schema.dropTable('teachers');
};

module.exports = { up, down };
