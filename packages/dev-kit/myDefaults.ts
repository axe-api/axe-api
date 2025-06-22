import { Resource, usePaginateHandler } from "axe-api";

export const defaultPagination = <T>(resource: Resource<T>) => {
  const pagination = usePaginateHandler(resource);
  pagination.patch({
    defaultPerPage: 25,
    maxPerPage: 100,
  });
  return pagination;
};
