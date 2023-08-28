import { IStepDefinition } from "src/Interfaces";
import { PhaseFunction } from "src/Types";

class Phase implements IStepDefinition {
  private callback: PhaseFunction;
  private phaseName: string;

  constructor(name: string, callback: PhaseFunction) {
    this.phaseName = name;
    this.callback = callback;
  }

  get(): PhaseFunction {
    return this.callback;
  }

  get name() {
    return this.phaseName;
  }

  isAsync() {
    return true;
  }
}

export default Phase;
