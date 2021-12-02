export const up = function (knex) {
  return knex.schema.createTable("units", function (table) {
    table.uuid("uuid").primary();
    table.string("title").nullable();
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("units");
};
