const up = function (knex) {
  return knex.schema.createTable("soft_delete_1", function (table) {
    table.increments();
    table.string("name").nullable();
    table.timestamps();
  });
};

const down = function (knex) {
  return knex.schema.dropTable("soft_delete_1");
};

module.exports = { up, down };
