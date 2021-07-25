const getDatabaseColumns = async (knex, schema) => {
  const { rows } = await knex.raw(
    `
      SELECT C.*, TC.constraint_type = 'PRIMARY KEY' AS is_primary
      FROM information_schema.columns C
      LEFT JOIN information_schema.key_column_usage KCU ON KCU.table_name = C.table_name AND KCU.column_name = C.column_name
      LEFT JOIN information_schema.table_constraints TC ON TC.constraint_name  = KCU.constraint_name
      WHERE C.table_schema = ?
    `,
    [schema]
  );
  return rows;
};

export default async ({ knex, schema }) => {
  const databaseColumns = await getDatabaseColumns(knex, schema);

  if (!databaseColumns) {
    throw new Error("Auto-column detection is failed on PostgreSQL!");
  }

  return databaseColumns.map((i) => {
    return {
      name: i.column_name,
      tableName: i.table_name,
      isNullable: i.is_nullable === "YES",
      dataType: i.data_type,
      defaultValue: i.column_default,
      maxLength: i.character_maximum_length,
      numericPrecision: i.numeric_precision,
      numericScale: i.numeric_scale,
      isPrimary: i.is_primary ? i.is_primary : false,
      isAutoIncrement:
        i.column_default && i.column_default.indexOf("nextval") > -1,
    };
  });
};
