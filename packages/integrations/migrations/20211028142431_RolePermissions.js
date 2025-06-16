const up = function (knex) {
  return knex.schema.createTable("role_permissions", function (table) {
    table.increments();
    table.string("title");
    table.integer("role_id").unsigned().nullable();
    table.timestamps();

    table
      .foreign("role_id")
      .references("roles.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

const down = function (knex) {
  return knex.schema.dropTable("role_permissions");
};

module.exports = { up, down };
