import NodeCache from "node-cache";
import { ICacheAdaptor } from "src/Interfaces";

class MemoryAdaptor implements ICacheAdaptor {
  private client: NodeCache;

  constructor() {
    this.client = new NodeCache();
  }

  async get(key: string) {
    return this.client.get<string>(`${key}`) || null;
  }

  async set(key: string, value: string, ttl: number) {
    this.client.set(`${key}`, value, ttl);
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
