import { ExtractModel, UResource } from "./xTypes";

export type UPaginate<Model> = {
  fields: (columns: Array<keyof Model>) => void;
  setDefaultPerPage: (perPage: number) => void;
};

export const uPaginate = <AnyModel>(resouce: UResource<AnyModel>) => {
  type Model = ExtractModel<AnyModel>;

  return {
    fields(columns: Array<keyof Model>) {
      console.log("fields", columns);
    },
    setDefaultPerPage(perPage: number) {
      console.log("setDefaultPerPage", perPage);
    },
  } as UPaginate<Model>;
};
