import { DEFAULT_HANDLERS, HandlerTypes, Model, rateLimit } from "axe-api";

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

  another() {
    return this.hasMany("FeedView", "id", "feed_id", { autoRouting: false });
  }

  get handlers() {
    return [...DEFAULT_HANDLERS, HandlerTypes.ALL];
  }

  get middlewares() {
    return [
      {
        handler: [HandlerTypes.PAGINATE],
        middleware: rateLimit({
          maxRequests: 2,
          windowInSeconds: 5,
        }),
      },
    ];
  }
}

export default Feed;
