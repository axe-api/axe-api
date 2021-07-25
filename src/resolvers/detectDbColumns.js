import IoC from "./../core/IoC.js";
import {
  mySQLDetector,
  sqliteDetector,
  postgresDetector,
} from "./databaseDetectors/index.js";

const DATABASE_DETECTORS = {
  mysql: mySQLDetector,
  sqlite3: sqliteDetector,
  postgres: postgresDetector,
};

const getDatabaseDetector = (databaseClient) => {
  const detector = DATABASE_DETECTORS[databaseClient];
  if (detector) {
    return detector;
  }
  throw new Error(`Unsupported database client: ${databaseClient}`);
};

const getDatabaseColumns = async () => {
  const Config = await IoC.use("Config");
  const database = await IoC.use("Database");
  const databaseClient = Config.Database.client.toLowerCase();
  const detector = getDatabaseDetector(databaseClient);
  let schema = Config.Database.connection.database;
  if (Config.Database.client === "postgres") {
    schema =
      Config.Database.connection.searchPath[
        Config.Database.connection.searchPath.length - 1
      ];
  }
  return await detector({
    knex: database,
    schema,
  });
};

const bindModelColumns = (models, columns) => {
  for (const model of models) {
    model.instance.columns = columns.filter(
      (column) => column.tableName === model.instance.table
    );

    if (model.instance.columns.length === 0) {
      throw new Error(
        `The "${model.instance.table}" table doesn't have any column. Are you sure about the table name?`
      );
    }

    model.instance.columnNames = model.instance.columns.map((i) => i.name);
  }
};

export default async (models) => {
  const columns = await getDatabaseColumns();
  bindModelColumns(models, columns);
};
