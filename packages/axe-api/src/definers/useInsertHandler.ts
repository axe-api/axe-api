import { Resource } from "./useResource";

type ExtractModel<T> = T;

export const useInsertHandler = <Model>(resource: Resource<Model>) => {
  type T = ExtractModel<Model>;

  return {
    fillable(columns: Array<keyof T>) {
      resource.config.fillables = columns;
      return this;
    },
  } as Return<T>;
};

type Return<T> = {
  fillable: (columns: Array<keyof T>) => Return<T>;
};
