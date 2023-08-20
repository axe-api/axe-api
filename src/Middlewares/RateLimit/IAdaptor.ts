interface IAdaptor {
  get(key: string): Promise<string | null>;

  set(key: string, value: string, ttl: number): Promise<void>;

  decr(key: string, ttl: number): Promise<void>;
}

export default IAdaptor;
