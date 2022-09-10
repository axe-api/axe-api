import { DependencyTypes } from "../Enums";
import { IDependency } from "../Interfaces";

class IoCService {
  private static items: Record<string, IDependency> = {};

  static bind(name: string, callback: any) {
    this._add(DependencyTypes.BIND, name, callback);
  }

  static singleton(name: string, callback: any) {
    this._add(DependencyTypes.SINGLETON, name, callback);
  }

  static async use(name: string): Promise<any> {
    const item = IoCService.items[name];
    if (!item) {
      throw new Error(`Dependency is not found ${name}`);
    }

    if (item.type === DependencyTypes.BIND) {
      return await item.callback();
    }

    if (item.instance) {
      return item.instance;
    }

    item.instance = await item.callback();
    return item.instance;
  }

  static async useByType<T>(name: string): Promise<T> {
    const result = await IoCService.use(name);
    return result as T;
  }

  private static _add(type: DependencyTypes, name: string, callback: any) {
    IoCService.items[name] = {
      type,
      callback,
      instance: null,
    };
  }
}

export default IoCService;
