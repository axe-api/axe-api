import { StatusCodes } from "../Enums";

class ApiError extends Error {
  type: string;
  status: StatusCodes;
  message: string;

  constructor(message: string, status: StatusCodes = StatusCodes.BAD_REQUEST) {
    super(message);
    this.type = "ApiError";
    this.status = status;
    this.message = message;
  }
}
export default ApiError;
