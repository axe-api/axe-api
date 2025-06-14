const up = function (knex) {
  return knex.schema.createTable("feeds", function (table) {
    table.increments();
    table.integer("reshare_id").unsigned().nullable();
    table.integer("parent_id").unsigned().nullable();
    table.string("title");
    table.timestamps();

    table.foreign("reshare_id").references("feeds.id");
    table.foreign("parent_id").references("feeds.id");
  });
};

const down = function (knex) {};

module.exports = { up, down };
