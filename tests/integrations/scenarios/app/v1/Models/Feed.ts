import { Model } from "axe-api";

class Feed extends Model {
  parent() {
    return this.hasOne("Feed", "id", "parent_id");
  }

  reshare() {
    return this.hasOne("Feed", "id", "reshare_id");
  }

  views() {
    return this.hasMany("FeedView", "id", "feed_id");
  }
}

export default Feed;
