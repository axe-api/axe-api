const up = function (knex) {
  return knex.schema.createTable("soft_delete_2", function (table) {
    table.increments();
    table.integer("parent_id").nullable().unsigned();
    table.string("name").nullable();
    table.timestamps();
    table.datetime("deleted_at").nullable();

    table
      .foreign("parent_id")
      .references("soft_delete_1.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

const down = function (knex) {
  return knex.schema.dropTable("soft_delete_2");
};

module.exports = { up, down };
