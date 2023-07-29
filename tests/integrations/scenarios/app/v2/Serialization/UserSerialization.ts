import { AxeRequest } from "axe-api";

export default (item: any, request: AxeRequest) => {
  return {
    ...item,
    fullname: `${item.name} ${item.surname}`,
  };
};
