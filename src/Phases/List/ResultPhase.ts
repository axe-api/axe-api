import { Knex } from "knex";
import { IRequestPack } from "../../Interfaces";
import { LogService } from "../../Services";

export default async (context: IRequestPack) => {
  const { database, isTransactionOpen, result, res } = context;

  // If there is a valid transaction, we should commit it
  if (isTransactionOpen) {
    LogService.warn("\tDB transaction commit");
    (database as Knex.Transaction).commit();
  }

  res.json(result);
};
