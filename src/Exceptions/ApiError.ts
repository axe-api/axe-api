import { StatusCodes } from "../Enums";

class ApiError extends Error {
  type: string;
  status: StatusCodes;
  message: string;

  constructor(message: string) {
    super(message);
    this.type = "ApiError";
    this.status = StatusCodes.BAD_REQUEST;
    this.message = message;
  }
}

export default ApiError;
