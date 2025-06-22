import { UserSchema } from "./resource";
import { uPaginate, uResource } from "axe-api";
import { UResource } from "axe-api/build/src/definers/xTypes";
import { render } from "prettyjson";

const resource = uResource(UserSchema);
resource.primaryKey("id");

const defaultPagination = <Model>(resource: UResource<Model>) => {
  const pagination = uPaginate(resource);
  pagination.setDefaultPerPage(25);
  return pagination;
};

const paginate = defaultPagination(resource);
paginate.fields(["name", "email"]);

console.log(render(resource));
