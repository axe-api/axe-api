import { CacheStrategies, Model } from "axe-api";

class Role extends Model {
  get fillable() {
    return ["title"];
  }

  get cache() {
    return {
      enable: true,
      ttl: 3,
      invalidation: CacheStrategies.TagBased,
    };
  }

  permissions() {
    return this.hasMany("RolePermission", "id", "role_id");
  }
}

export default Role;
