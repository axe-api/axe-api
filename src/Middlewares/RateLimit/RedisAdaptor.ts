import { createClient } from "redis";
import { ICacheAdaptor } from "../../Interfaces";

type RedisClientType = ReturnType<typeof createClient>;
type RedisClientOptions = Parameters<typeof createClient>[0];

class RedisAdaptor implements ICacheAdaptor {
  private client: RedisClientType;
  private prefix: string;

  constructor(options: RedisClientOptions | undefined, prefix: string) {
    this.client = createClient(options);
    this.prefix = prefix;
    this.client.connect();
  }

  async get(key: string) {
    return await this.client.get(`${this.prefix}${key}`);
  }

  async set(key: string, value: string, ttl: number) {
    await this.client.setEx(`${this.prefix}${key}`, ttl, value);
  }

  async tags(keys: string[], value: string) {
    keys.forEach((key) => {
      this.client.sAdd(key, [value]);
    });
  }

  async getTagMemebers(tag: string) {
    return await this.client.sMembers(tag);
  }

  async delete(keys: string[]) {
    return await this.client.del(keys);
  }

  async decr(key: string) {
    await this.client.decr(`${this.prefix}${key}`);
  }

  async searchTags(pattern: string) {
    return await this.client.scan(0, {
      MATCH: pattern,
    });
  }
}

export default RedisAdaptor;
