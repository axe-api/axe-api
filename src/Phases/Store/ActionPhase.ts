import { IRequestPack } from "../../Interfaces";

interface ISafeResult {
  status: boolean;
  data?: any;
  error?: any;
}

const safe = (callback: any): Promise<ISafeResult> => {
  return new Promise((resolve) => {
    callback()
      .then((data: any) => resolve({ status: true, data }))
      .catch((error: any) => resolve({ status: false, error }));
  });
};

export default async (context: IRequestPack) => {
  // const result = await safe(() => {
  //   return context
  //     .database(context.model.instance.table)
  //     .insert(context.formData)
  //     .returning(context.model.instance.primaryKey);
  // });

  // if (!result.status) {
  //   context.res.json(result.error, 500);
  //   return;
  // }

  const [returningResult] = await context
    .database(context.model.instance.table)
    .insert(context.formData)
    .returning(context.model.instance.primaryKey);

  let insertedPrimaryKeyValue =
    typeof returningResult === "number"
      ? returningResult
      : returningResult[context.model.instance.primaryKey];

  // If the user use a special primary key value, we should use that value
  if (insertedPrimaryKeyValue === 0) {
    insertedPrimaryKeyValue =
      context.formData[context.model.instance.primaryKey];
  }

  context.item = await context
    .database(context.model.instance.table)
    .where(context.model.instance.primaryKey, insertedPrimaryKeyValue)
    .first();
};
