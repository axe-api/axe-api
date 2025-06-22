import { NewHandlerTypes } from "src/newTypes";
import { Resource } from "./useResource";

export type ExtractModel<T> = T;

export interface BaseHandler<T> {
  /**
   * @internal
   */
  type: NewHandlerTypes;
}

export interface InsertHandler<T> extends BaseHandler<T> {
  /**
   * @internal
   */
  fillables: Array<keyof T>;

  fillable: (columns: Array<keyof T>) => InsertHandler<T>;
}

export interface PaginateHandler<T> extends BaseHandler<T> {
  /**
   * @internal
   */
  minPerPage: number;
  /**
   * @internal
   */
  defaultPerPage: number;
  /**
   * @internal
   */
  maxPerPage: number;

  setMinPerPage: (perPage: number) => PaginateHandler<T>;
  setDefaultPerPage: (perPage: number) => PaginateHandler<T>;
  setMaxPerPage: (perPage: number) => PaginateHandler<T>;
}

export const useStoreHandler = <Model>(resource: Resource<Model>) => {
  type T = ExtractModel<Model>;

  const handler: InsertHandler<T> = {
    type: "store",
    fillables: [],
    fillable(columns: Array<keyof T>) {
      handler.fillables = columns;
      return this;
    },
  };

  return handler;
};

export const usePaginateHandler = <Model>(resource: Resource<Model>) => {
  type T = ExtractModel<Model>;

  const handler: PaginateHandler<T> = {
    type: "paginate",
    minPerPage: 5,
    defaultPerPage: 10,
    maxPerPage: 25,
    setMinPerPage(perPage: number) {
      handler.minPerPage = perPage;
      return this;
    },
    setDefaultPerPage(perPage: number) {
      handler.defaultPerPage = perPage;
      return this;
    },
    setMaxPerPage(perPage: number) {
      handler.maxPerPage = perPage;
      return this;
    },
  };

  return handler;
};

// export const useShowHandler = <Model>(resource: Resource<Model>) => {
//   type T = ExtractModel<Model>;

//   const handler: BaseHandler<T> = {
//     type: "show",
//   };

//   return handler;
// };

// export const useUpdateHandler = <Model>(resource: Resource<Model>) => {
//   type T = ExtractModel<Model>;

//   const handler: BaseHandler<T> = {
//     type: "update",
//   };

//   return handler;
// };

// export const useDestroyHandler = <Model>(resource: Resource<Model>) => {
//   type T = ExtractModel<Model>;

//   const handler: BaseHandler<T> = {
//     type: "destroy",
//   };

//   return handler;
// };

// export const useForceDeleteHandler = <Model>(resource: Resource<Model>) => {
//   type T = ExtractModel<Model>;

//   const handler: BaseHandler<T> = {
//     type: "force_delete",
//   };

//   return handler;
// };

// export const usePatchHandler = <Model>(resource: Resource<Model>) => {
//   type T = ExtractModel<Model>;

//   const handler: BaseHandler<T> = {
//     type: "patch",
//   };

//   return handler;
// };

// export const useAllHandler = <Model>(resource: Resource<Model>) => {
//   type T = ExtractModel<Model>;

//   const handler: BaseHandler<T> = {
//     type: "all",
//   };

//   return handler;
// };

// export const useSearchHandler = <Model>(resource: Resource<Model>) => {
//   type T = ExtractModel<Model>;

//   const handler: BaseHandler<T> = {
//     type: "search",
//   };

//   return handler;
// };
