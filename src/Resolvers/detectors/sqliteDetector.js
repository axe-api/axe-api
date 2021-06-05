export default async ({ knex }) => {
  const tables = (await knex.table("sqlite_master").where("type", "table")).map(
    (item) => item.tbl_name
  );

  const columns = [];

  for (const table of tables) {
    const result = await knex.raw(`
      select * from pragma_table_info("${table}")
    `);
    columns.push(
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

  return columns;
};
