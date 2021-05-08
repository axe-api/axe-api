import pluralize from "pluralize";
class Model {
  get table() {
    return pluralize(this.constructor.name.toLowerCase());
  }

  get fillable() {
    return [];
  }

  get validations() {
    return null;
  }

  get relations() {
    return [];
  }

  get actions() {
    return ["GET", "POST", "PUT", "DELETE"];
  }
}

export default Model;
