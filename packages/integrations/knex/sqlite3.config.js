module.exports = async () => {
  return {
    client: "sqlite3",
    connection: {
      filename: "../axedb.sql",
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "../migrations",
    },
  };
};
