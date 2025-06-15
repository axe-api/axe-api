module.exports = async () => {
  return {
    client: "cockroachdb",
    connection: {
      host: "127.0.0.1",
      user: process.env.TEST_USER,
      password: process.env.TEST_PASSWORD,
      database: process.env.TEST_DATABASE,
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
