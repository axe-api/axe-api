import { IRequestPack } from "../../Interfaces";

export default async (context: IRequestPack) => {
  if (context.query) {
    await context.query
      .where(
        context.model.instance.primaryKey,
        context.item[context.model.instance.primaryKey]
      )
      .update(context.formData);

    context.item = await context
      .database(context.model.instance.table)
      .where(
        context.model.instance.primaryKey,
        context.item[context.model.instance.primaryKey]
      )
      .first();
  }
};
