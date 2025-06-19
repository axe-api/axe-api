export type NewHandlerTypes =
  | "store"
  | "paginate"
  | "show"
  | "update"
  | "destroy"
  | "force_delete"
  | "patch"
  | "all"
  | "search";

export type Resource<T> = {
  table: string;
  primaryKey: keyof T;
  columns: Array<keyof T>;
};
