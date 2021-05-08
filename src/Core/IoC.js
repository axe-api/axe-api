const TYPES = {
  BIND: "BIND",
  SINGLETON: "SINGLETON",
};

const items = {};

const IoC = {
  bind(name, callback) {
    this._add(TYPES.BIND, name, callback);
  },

  singleton(name, callback) {
    this._add(TYPES.SINGLETON, name, callback);
  },

  async use(name) {
    const item = items[name];
    if (!item) {
      throw new Error(`Dependency is not found ${name}`);
    }

    if (item.type === TYPES.BIND) {
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
