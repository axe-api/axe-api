import { IModelService } from "../Interfaces";
import { toTableName } from "./shared";

const toColumnTypes = (columnNames: string[]) => {
  return columnNames.map((name) => `'${name}'`).join(" | ");
};

export const generateTable = async (model: IModelService): Promise<string> => {
  const tableName = toTableName(model.instance.table);
  const columnTypes = toColumnTypes(model.columnNames);

  return `export namespace ${toTableName(tableName)} {
  export type Columns = ${columnTypes};
}`;
};
