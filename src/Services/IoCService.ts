import { DependencyTypes } from "../Enums";
import { IDependency } from "../Interfaces";

type DependencyCallback<T = any> = () => T | Promise<T>;

class IoCService {
  private static items: Record<string, IDependency> = {};

  static bind<T = any>(name: string, callback: DependencyCallback<T>) {
    this._add(DependencyTypes.BIND, name, callback);
  }

  static singleton<T = any>(name: string, callback: DependencyCallback<T>) {
    this._add(DependencyTypes.SINGLETON, name, callback);
  }

  static fastSingleton<T = any>(name: string, callback: DependencyCallback<T>) {
    this._add(DependencyTypes.SINGLETON, name, callback);
    void this.use(name); // fire and forget
  }

  static async use<T = any>(name: string): Promise<T> {
    const result = await this.getByName(name);
    return result as T;
  }

  private static async getByName(name: string): Promise<any> {
    const item = this.items[name];
    if (!item) {
      throw new Error(`Dependency is not found: ${name}`);
    }

    if (item.type === DependencyTypes.BIND) {
      return await this.resolve(item.callback);
    }

    if (item.instance) {
      return item.instance;
    }

    item.instance = await this.resolve(item.callback);
    return item.instance;
  }

  private static _add(
    type: DependencyTypes,
    name: string,
    callback: DependencyCallback,
  ) {
    this.items[name] = {
      type,
      callback,
      instance: null,
    };
  }

  private static async resolve(callback: DependencyCallback): Promise<any> {
    try {
      return await callback();
    } catch (error) {
      throw new Error(`Failed to resolve dependency: ${error}`);
    }
  }
}

export default IoCService;
