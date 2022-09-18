import { Model, HandlerTypes } from "axe-api";

const { INSERT, SHOW, UPDATE } = HandlerTypes;

class Unit extends Model {
  get primaryKey() {
    return "uuid";
  }

  get fillable() {
    return {
      POST: ["uuid", "title"],
      PUT: ["title"],
    };
  }

  get validations() {
    return {
      POST: {
        title: "required|min:1",
      },
      PUT: {
        title: "required",
      },
    };
  }

  get createdAtColumn() {
    return null;
  }

  get updatedAtColumn() {
    return null;
  }

  get handlers() {
    return [INSERT, SHOW, UPDATE];
  }
}

export default Unit;
