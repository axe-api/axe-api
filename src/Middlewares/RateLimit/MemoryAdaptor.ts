import NodeCache from "node-cache";
import { ICacheAdaptor } from "src/Interfaces";

class MemoryAdaptor implements ICacheAdaptor {
  private client: NodeCache;
  private prefix: string;

  constructor(prefix: string) {
    this.client = new NodeCache();
    this.prefix = prefix;
  }

  async get(key: string) {
    return this.client.get<string>(`${this.prefix}${key}`) || null;
  }

  async set(key: string, value: string, ttl: number) {
    this.client.set(`${this.prefix}${key}`, value, ttl);
  }

  async decr(key: string, ttl: number) {
    const value = await this.get(key);
    if (value) {
      const newValue = parseInt(value) - 1;
      this.set(key, newValue.toString(), ttl);
    }
  }
}

export default MemoryAdaptor;
