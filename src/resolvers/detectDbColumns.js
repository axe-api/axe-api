import schemaInspector from "knex-schema-inspector";
import IoC from "./../core/IoC.js";

const getDatabaseColumns = async () => {
  const database = await IoC.use("Database");
  const inspector = schemaInspector.default(database);
  const databaseColumns = [];
  for (const table of await inspector.tables()) {
    const columns = await inspector.columnInfo(table);
    databaseColumns.push(
      ...columns.map((column) => {
        return {
          ...column,
          table_name: table,
        };
      })
    );
  }

  return databaseColumns;
};

const bindModelColumns = (models, columns) => {
  for (const model of models) {
    model.instance.columns = columns.filter(
      (column) => column.table_name === model.instance.table
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
