module.exports = async () => {
  return {
    client: "cockroachdb",
    connection: {
      host: "127.0.0.1",
      user: "axeapi",
      password: "123456",
      database: "axeapi",
      port: 26257,
      searchPath: ["axeapi", "public"],
      filename: "./axedb.sql",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "../migrations",
    },
  };
};
