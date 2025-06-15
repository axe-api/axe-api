module.exports = async () => {
  return {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "axeapi",
      password: "123456",
      database: "axeapi",
      port: 3308,
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
