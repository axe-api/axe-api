import { DependencyTypes } from "../Enums";
import { IDependency } from "../Interfaces";

class IoCService {
  private static items: Record<string, IDependency> = {};

  /**
   * Adding a dependency creator function.
   *
   * @param name
   * @param callback
   * @example
   *
   * IoCService.bind("MailService", () => new MyMailService())
   */
  static bind(name: string, callback: any) {
    this._add(DependencyTypes.BIND, name, callback);
  }

  /**
   * Adding a singleton dependency creator function.
   *
   * @param name
   * @param callback
   * @example
   *
   * IoCService.singleton("MySingleton", () => new MySingleton())
   */
  static singleton(name: string, callback: any) {
    this._add(DependencyTypes.SINGLETON, name, callback);
  }

  /**
   * Getting the service by the name.
   *
   * @param name
   * @param callback
   * @example
   *
   * await IoCService.use<MySingleton>("MySingleton")
   */
  static async use<T>(name: string): Promise<T> {
    const result = await IoCService.getByName(name);
    return result as T;
  }

  private static async getByName(name: string): Promise<any> {
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

  private static _add(type: DependencyTypes, name: string, callback: any) {
    IoCService.items[name] = {
      type,
      callback,
      instance: null,
    };
  }
}

export default IoCService;
