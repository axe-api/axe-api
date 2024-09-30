const up = function (knex) {
  return knex.schema.createTable("feed_views", function (table) {
    table.increments();
    table.integer("feed_id").unsigned().notNullable();
    table.string("title");
    table.timestamps();

    table
      .foreign("feed_id")
      .references("feeds.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

const down = function (knex) {
  return knex.schema.dropTable("feed_views");
};

module.exports = { up, down };
