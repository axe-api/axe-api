import {
  IModelService,
  IHandlerBasedTransactionConfig,
  IVersion,
} from "../Interfaces";
import { HandlerTypes } from "../Enums";

class TransactionResolver {
  private version: IVersion;

  constructor(version: IVersion) {
    this.version = version;
  }

  public async resolve(
    model: IModelService,
    handlerType: HandlerTypes
  ): Promise<boolean> {
    const global = this.version.config.transaction;
    const local = model.instance.transaction;
    let privilegedOption = false;

    if (global) {
      privilegedOption = TransactionResolver.resolveTransactionOption(
        global,
        handlerType,
        privilegedOption
      );
    }

    if (local !== null) {
      privilegedOption = TransactionResolver.resolveTransactionOption(
        local,
        handlerType,
        privilegedOption
      );
    }

    return privilegedOption;
  }

  private static resolveTransactionOption = (
    option:
      | boolean
      | IHandlerBasedTransactionConfig
      | IHandlerBasedTransactionConfig[],
    handlerType: HandlerTypes,
    defaultValue: boolean
  ): boolean => {
    if (Array.isArray(option)) {
      // If this is an array, we should treat it like an array.
      const configs = option as IHandlerBasedTransactionConfig[];

      // We should check every item of the array
      for (const configItem of configs) {
        const value = TransactionResolver.getTransactionConfiguration(
          configItem,
          handlerType
        );
        if (value) {
          defaultValue = configItem.transaction;
        }
      }
    } else if (typeof option === "boolean") {
      // Developer should be able to select a boolean value for all kind of routes
      defaultValue = option;
    } else {
      const configItem = option as IHandlerBasedTransactionConfig;
      const value = TransactionResolver.getTransactionConfiguration(
        configItem,
        handlerType
      );
      if (value) {
        defaultValue = configItem.transaction;
      }
    }

    return defaultValue;
  };

  private static getTransactionConfiguration(
    configItem: IHandlerBasedTransactionConfig,
    handlerType: HandlerTypes
  ): boolean | null {
    // An item definitions might have handler array such as;
    //
    // handler: [HandlerTypes.ALL, HandlerTypes.INSERT]
    if (Array.isArray(configItem.handler)) {
      // If this is an array, we should find the matched handler type
      const found = (configItem.handler as HandlerTypes[]).find(
        (item) => item === handlerType
      );

      // If there is, this is the our transaction choice
      if (found) {
        return configItem.transaction;
      }
    } else if ((configItem.handler as HandlerTypes) === handlerType) {
      // If the "configItem.handler" is not an array, should be matched
      // with the handlerType. If it matches, it means that this is our
      // transaction configuration
      return configItem.transaction;
    }

    return null;
  }
}

export default TransactionResolver;
