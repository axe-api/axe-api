import { Resource } from "./useResource";

type ExtractModel<T> = T;

export const useInsertHandler = <Model>(resource: Resource<Model>) => {
  type T = ExtractModel<Model>;

  return {
    fillable(columns: Array<keyof T>) {
      resource.config.fillables = columns;
      return this;
    },
  } as InserHandler<T>;
};

type InserHandler<T> = {
  fillable: (columns: Array<keyof T>) => InserHandler<T>;
};
