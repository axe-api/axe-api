const up = function (knex) {
  return knex.schema.createTable("roles", function (table) {
    table.increments();
    table.string("title");
    table.timestamps();
  });
};

const down = function (knex) {
  return knex.schema.dropTable("roles");
};

module.exports = { up, down };
