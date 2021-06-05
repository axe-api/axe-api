import { DEPENDECY_TYPES } from "./../constants.js";

const items = {};

const IoC = {
  bind(name, callback) {
    this._add(DEPENDECY_TYPES.BIND, name, callback);
  },

  singleton(name, callback) {
    this._add(DEPENDECY_TYPES.SINGLETON, name, callback);
  },

  async use(name) {
    const item = items[name];
    if (!item) {
      throw new Error(`Dependency is not found ${name}`);
    }

    if (item.type === DEPENDECY_TYPES.BIND) {
      return await item.callback();
    }

    if (item.instance) {
      return item.instance;
    }

    item.instance = await item.callback();
    return item.instance;
  },

  _add(type, name, callback) {
    items[name] = {
      type,
      callback,
      instance: null,
    };
  },
};

export default IoC;
