import { createClient } from "redis";
import { ICacheAdaptor } from "../../Interfaces";
import { LogService } from "../../Services";

type RedisClientType = ReturnType<typeof createClient>;
type RedisClientOptions = Parameters<typeof createClient>[0];

class RedisAdaptor implements ICacheAdaptor {
  private client: RedisClientType;
  private prefix: string;
  private isConnected: boolean;

  constructor(options: RedisClientOptions | undefined, prefix: string) {
    this.client = createClient(options);
    this.prefix = prefix;
    this.isConnected = false;
  }

  isReady() {
    return this.isConnected;
  }

  async connect() {
    try {
      await this.client.connect();
      this.isConnected = true;
    } catch (error: any) {
      LogService.error(`Redis Connection Error: ${error.message}`);
    }
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
