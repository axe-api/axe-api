import { Resource } from "./defineResource";

type ExtractModel<T> = T;

export const useInsertHandler = <Model>(resource: Resource<Model>) => {
  type T = ExtractModel<Model>;

  return {
    fillable: (columns: Array<keyof T>) => {
      resource.config.fillables = columns;
    },
  };
};
