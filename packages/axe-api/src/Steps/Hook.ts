import { HookFunctionTypes } from "@/Enums";
import { IModelService, IStepDefinition } from "@/Interfaces";
import { PhaseFunction } from "@/Types";

class Hook implements IStepDefinition {
  private readonly hookFunctionType: HookFunctionTypes;

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
