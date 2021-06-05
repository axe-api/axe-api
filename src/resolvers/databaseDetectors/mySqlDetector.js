const getDatabaseColumns = async (knex, schema) => {
  return await knex
    .table("information_schema.columns")
    .where("table_schema", schema);
};

export default async ({ knex, schema }) => {
  const databaseColumns = await getDatabaseColumns(knex, schema);

  if (!databaseColumns) {
    throw new Error("Auto-column detection is failed on MySQL!");
  }

  return databaseColumns.map((i) => {
    return {
      name: i.COLUMN_NAME,
      tableName: i.TABLE_NAME,
      isNullable: i.IS_NULLABLE === "YES",
      dataType: i.DATA_TYPE,
      defaultValue: i.COLUMN_DEFAULT,
      maxLength: i.CHARACTER_MAXIMUM_LENGTH,
      numericPrecision: i.NUMERIC_PRECISION,
      numericScale: i.NUMERIC_SCALE,
      isPrimary: i.COLUMN_KEY === "PRI",
      isAutoIncrement: i.EXTRA === "auto_increment",
    };
  });
};
