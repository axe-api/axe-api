const up = function (knex) {
  return knex.schema.createTable("categories", function (table) {
    table.increments();
    table.integer("parent_id").nullable().unsigned();
    table.string("title").nullable();
    table.timestamps();

    table
      .foreign("parent_id")
      .references("categories.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

const down = function (knex) {
  return knex.schema.dropTable("categories");
};

module.exports = { up, down };
