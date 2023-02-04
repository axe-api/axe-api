import { Request } from "express";

export default (item: any, request: Request) => {
  return {
    ...item,
    fullname: `${item.name} ${item.surname}`,
  };
};
