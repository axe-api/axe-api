import { AxeErrorCode } from "src/Enums";

class AxeError extends Error {
  type: string;
  code: AxeErrorCode;
  message: string;

  constructor(code: AxeErrorCode, message: string) {
    super(message);
    this.type = "AxeError";
    this.code = code;
    this.message = message;
  }
}

export default AxeError;
