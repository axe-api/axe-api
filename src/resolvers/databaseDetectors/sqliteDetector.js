const getDatabaseTables = async (knex) => {
  return (await knex.table("sqlite_master").where("type", "table")).map(
    (item) => item.tbl_name
  );
};

const getDatabaseColumnsByTable = async (knex, table) => {
  return await knex.raw(`select * from pragma_table_info("${table}")`);
};

export default async ({ knex }) => {
  const databaseTables = await getDatabaseTables(knex);
  const databaseColumns = [];

  for (const table of databaseTables) {
    const result = await getDatabaseColumnsByTable(knex, table);
    databaseColumns.push(
      ...result.map((i) => {
        return {
          name: i.name,
          tableName: table,
          isNullable: i.notnull === 0,
          dataType: i.type,
          defaultValue: i.dflt_value,
          maxLength: null,
          numericPrecision: null,
          numericScale: null,
          isPrimary: i.pk === 1,
          isAutoIncrement: null,
        };
      })
    );
  }

  return databaseColumns;
};
