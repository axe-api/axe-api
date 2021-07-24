export const up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments();
    table.string("email").unique();
    table.string("name");
    table.string("surname");
    table.string("password_salt");
    table.string("password_hash");
    table.timestamps();
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("users");
};
