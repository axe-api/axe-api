import { HookFunctionTypes } from "src/Enums";
import { IModelService, IStepDefinition } from "src/Interfaces";
import { PhaseFunction } from "src/Types";

class Event implements IStepDefinition {
  private hookFunctionType: HookFunctionTypes;

  constructor(hookFunctionType: HookFunctionTypes) {
    this.hookFunctionType = hookFunctionType;
  }

  get(model: IModelService): PhaseFunction {
    return model.events[this.hookFunctionType];
  }

  get name() {
    return `event:${this.hookFunctionType}`;
  }

  isAsync() {
    return false;
  }
}

export default Event;
