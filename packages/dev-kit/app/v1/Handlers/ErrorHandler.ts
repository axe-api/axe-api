import { IncomingMessage, ServerResponse } from "http";
import { NextFunction } from "axe-api";
import "dotenv/config";

const ErrorHandler = (
  err: any,
  _req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction
) => {
  console.log("HANDLER");
  let error = {
    ...err,
    message: err.message,
    date: Date.now(),
  };

  if (process.env.NODE_ENV === "production") {
    error = {
      message: "An error occurred!",
    };
  }

  res.statusCode = 500;
  res.write(JSON.stringify(error));
  res.end();
  next();
};

export default ErrorHandler;
