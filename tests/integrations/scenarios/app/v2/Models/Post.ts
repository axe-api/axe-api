import { Model } from "axe-api";

class Post extends Model {
  get table() {
    return "posts";
  }

  get fillable() {
    return ["title", "content"];
  }

  get validations(): Record<string, string> {
    return {
      title: "required|max:100",
    };
  }

  user() {
    return this.belongsTo("User", "user_id", "id");
  }
}

export default Post;
