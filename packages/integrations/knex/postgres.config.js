module.exports = async () => {
  return {
    client: "postgres",
    connection: {
      host: "127.0.0.1",
      user: process.env.TEST_USER,
      password: process.env.TEST_PASSWORD,
      database: process.env.TEST_DATABASE,
      port: 5433,
      searchPath: ["axeapi", "public"],
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
