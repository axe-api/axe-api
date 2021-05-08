class Model {
  get table() {
    return null;
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
