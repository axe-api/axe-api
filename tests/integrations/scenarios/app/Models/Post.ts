import { Model, IMethodBaseValidations, HttpMethods } from "axe-api";

class Post extends Model {
  get table() {
    return "posts";
  }

  get fillable() {
    return ["title", "content"];
  }

  get validations(): IMethodBaseValidations {
    return {
      [HttpMethods.POST]: {
        title: "required|max:100",
      },
      [HttpMethods.PUT]: {
        title: "required|max:100",
      },
    };
  }

  user() {
    return this.belongsTo("User", "user_id", "id");
  }
}

export default Post;
