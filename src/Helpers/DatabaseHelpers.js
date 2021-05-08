import knex from "knex";

export const getDatabaseInstance = (configuration) => {
  return knex(configuration);
};
