import { createClient, RedisClientType } from "redis";
import { ICacheAdaptor, IRedisOptions } from "../../Interfaces";

class RedisAdaptor implements ICacheAdaptor {
  private client: RedisClientType;
  private prefix: string;

  constructor(options: IRedisOptions | undefined, prefix: string) {
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

  async decr(key: string) {
    await this.client.decr(`${this.prefix}${key}`);
  }
}

export default RedisAdaptor;
