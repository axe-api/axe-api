const SETTINGS: Record<string, Record<string, string>> = {
  mysql8: {
    NODE_ENV: "development",
    APP_PORT: "3000",
    DB_CLIENT: "mysql2",
    DB_HOST: "127.0.0.1",
    DB_USER: "axeapi",
    DB_PORT: "3307",
    DB_PASSWORD: "123456",
    DB_DATABASE: "axeapi",
    REDIS_URL: "redis://127.0.0.1:6380",
  },
  mysql57: {
    NODE_ENV: "development",
    APP_PORT: "3000",
    DB_CLIENT: "mysql",
    DB_HOST: "127.0.0.1",
    DB_USER: "axeapi",
    DB_PORT: "3307",
    DB_PASSWORD: "123456",
    DB_DATABASE: "axeapi",
    REDIS_URL: "redis://127.0.0.1:6380",
  },
  postgres11: {
    NODE_ENV: "development",
    APP_PORT: "3000",
    DB_CLIENT: "postgres",
    DB_HOST: "127.0.0.1",
    DB_USER: "axeapi",
    DB_PORT: "5433",
    DB_PASSWORD: "123456",
    DB_DATABASE: "axeapi",
    REDIS_URL: "redis://127.0.0.1:6380",
  },
  postgres12: {
    NODE_ENV: "development",
    APP_PORT: "3000",
    DB_CLIENT: "postgres",
    DB_HOST: "127.0.0.1",
    DB_USER: "axeapi",
    DB_PORT: "5433",
    DB_PASSWORD: "123456",
    DB_DATABASE: "axeapi",
    REDIS_URL: "redis://127.0.0.1:6380",
  },
  postgres13: {
    NODE_ENV: "development",
    APP_PORT: "3000",
    DB_CLIENT: "postgres",
    DB_HOST: "127.0.0.1",
    DB_USER: "axeapi",
    DB_PORT: "5433",
    DB_PASSWORD: "123456",
    DB_DATABASE: "axeapi",
    REDIS_URL: "redis://127.0.0.1:6380",
  },
  postgres14: {
    NODE_ENV: "development",
    APP_PORT: "3000",
    DB_CLIENT: "postgres",
    DB_HOST: "127.0.0.1",
    DB_USER: "axeapi",
    DB_PORT: "5433",
    DB_PASSWORD: "123456",
    DB_DATABASE: "axeapi",
    REDIS_URL: "redis://127.0.0.1:6380",
  },
  postgres15: {
    NODE_ENV: "development",
    APP_PORT: "3000",
    DB_CLIENT: "postgres",
    DB_HOST: "127.0.0.1",
    DB_USER: "axeapi",
    DB_PORT: "5433",
    DB_PASSWORD: "123456",
    DB_DATABASE: "axeapi",
    REDIS_URL: "redis://127.0.0.1:6380",
  },
  cockroach: {
    NODE_ENV: "development",
    APP_PORT: "3000",
    DB_CLIENT: "cockroachdb",
    DB_HOST: "127.0.0.1",
    DB_USER: "axeapi",
    DB_PORT: "26257",
    DB_PASSWORD: "123456",
    DB_DATABASE: "axeapi",
    REDIS_URL: "redis://127.0.0.1:6380",
  },
  mariadb: {
    NODE_ENV: "development",
    APP_PORT: "3000",
    DB_CLIENT: "mysql",
    DB_HOST: "127.0.0.1",
    DB_USER: "axeapi",
    DB_PORT: "3308",
    DB_PASSWORD: "123456",
    DB_DATABASE: "axeapi",
    REDIS_URL: "redis://127.0.0.1:6380",
  },
  sqlite: {
    NODE_ENV: "development",
    APP_PORT: "3000",
    DB_CLIENT: "sqlite3",
    REDIS_URL: "redis://127.0.0.1:6380",
  },
};

export const getEnvSettings = (dbType: string) => {
  const settings = SETTINGS[dbType];
  if (!settings) {
    throw new Error(`Unsupported database type: ${dbType}`);
  }
  return settings;
};

export const setEnvSettings = () => {
  const dbType: string = process.env.DB_PROVIDER || "sqlite";
  const settings = getEnvSettings(dbType);
  for (const [key, value] of Object.entries(settings)) {
    (process.env as any)[key] = value;
  }
  return settings;
};
