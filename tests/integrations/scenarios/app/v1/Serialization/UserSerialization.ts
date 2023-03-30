import { IRequest } from "axe-api";

export default (item: any, request: IRequest) => {
  return {
    ...item,
    fullname: `${item.name} ${item.surname}`,
  };
};
