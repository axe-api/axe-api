import { HookFunctionTypes } from "src/Enums";
import { IModelService, IStepDefinition } from "src/Interfaces";
import { PhaseFunction } from "src/Types";

class Hook implements IStepDefinition {
  private hookFunctionType: HookFunctionTypes;

  constructor(hookFunctionType: HookFunctionTypes) {
    this.hookFunctionType = hookFunctionType;
  }

  get(model: IModelService): PhaseFunction {
    return model.hooks[this.hookFunctionType];
  }

  get name() {
    return `hook:${this.hookFunctionType}`;
  }

  isAsync() {
    return true;
  }
}

export default Hook;
